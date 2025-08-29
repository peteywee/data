# main.py
import os
import psycopg2
from time import sleep
from fastapi import FastAPI, HTTPException
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from typing import List, Optional, Dict

app = FastAPI(title="Hierarchical Reasoning Assistant", version="1.0")

# --- DATABASE CONNECTION LOGIC ---
# Get the database URL from the environment variable set in docker-compose.yml
DATABASE_URL = os.getenv("DATABASE_URL")
conn = None

# Retry connecting to the database on startup
print("Attempting to connect to the database...")
for _ in range(5):
    try:
        # Connect to Postgres instead of SQLite
        conn = psycopg2.connect(DATABASE_URL)
        print("✅ Database connection successful")
        break  # Exit loop if connection is successful
    except psycopg2.OperationalError:
        print("🔴 Database connection failed, retrying in 5 seconds...")
        sleep(5)

if conn is None:
    print("❌ Could not connect to the database after several retries. Exiting.")
    exit(1)  # Exit if connection could not be established

# --- INITIALIZE DATABASE TABLE ---
# Use a 'with' statement for the cursor to ensure it's closed properly
with conn.cursor() as cursor:
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS memory (
        key TEXT PRIMARY KEY,
        value TEXT
    )
    """)
    conn.commit() # Commit the table creation
print("Table 'memory' initialized.")

# --- API Endpoints ---

@app.get("/")
def root():
    return RedirectResponse(url="/docs")

@app.get("/welcome")
def welcome():
    # Your GitHub username is peteywee, so I left this endpoint as is.
    return {"message": "Peteywee is a pimp"}

# Pydantic Models (no changes needed here)
class ObjectiveRequest(BaseModel):
    query: str

class ObjectiveResponse(BaseModel):
    objectiveId: str
    objective: str

class ClarifyRequest(BaseModel):
    query: str

class ClarifyResponse(BaseModel):
    clarificationId: str
    message: str
    options: List[str]

class SummarizeRequest(BaseModel):
    content: str
    length: Optional[str] = "short"

class SummarizeResponse(BaseModel):
    summary: str

class MemoryRequest(BaseModel):
    key: str
    value: str

class MemoryResponse(BaseModel):
    status: str
    stored: Dict[str, str]

class RecallRequest(BaseModel):
    key: str

class RecallResponse(BaseModel):
    key: str
    value: Optional[str]

class PolicyCheckRequest(BaseModel):
    content: str

class PolicyCheckResponse(BaseModel):
    validated: bool
    issues: List[str]


# API Route Handlers
@app.post("/strategic/objective", response_model=ObjectiveResponse)
def define_objective(req: ObjectiveRequest):
    return ObjectiveResponse(objectiveId="obj_001", objective=f"Processed objective: {req.query}")

@app.post("/strategic/clarify", response_model=ClarifyResponse)
def clarify_objective(req: ClarifyRequest):
    return ClarifyResponse(
        clarificationId="clar_001",
        message="Your request is broad. Please clarify.",
        options=["Affiliate marketing", "Email campaigns", "Social media strategy"]
    )

@app.post("/execution/summarize", response_model=SummarizeResponse)
def summarize_content(req: SummarizeRequest):
    short = req.content[:75] + "..." if len(req.content) > 75 else req.content
    return SummarizeResponse(summary=short if req.length == "short" else req.content)

@app.post("/memory/save", response_model=MemoryResponse)
def save_memory(req: MemoryRequest):
    # Use 'with' to manage the cursor
    with conn.cursor() as cursor:
        # PostgreSQL uses "INSERT ... ON CONFLICT" instead of SQLite's "REPLACE INTO"
        # Parameters are specified with %s, not ?
        cursor.execute(
            """
            INSERT INTO memory (key, value) VALUES (%s, %s)
            ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
            """,
            (req.key, req.value)
        )
        # You must commit the transaction
        conn.commit()
    return MemoryResponse(status="saved", stored={req.key: req.value})

@app.post("/memory/recall", response_model=RecallResponse)
def recall_memory(req: RecallRequest):
    value = None
    with conn.cursor() as cursor:
        # Parameters are specified with %s, not ?
        # Note the comma in (req.key,) to make it a tuple
        cursor.execute("SELECT value FROM memory WHERE key = %s", (req.key,))
        row = cursor.fetchone()
        if row:
            value = row[0]
    return RecallResponse(key=req.key, value=value)

@app.post("/validation/policycheck", response_model=PolicyCheckResponse)
def policy_check(req: PolicyCheckRequest):
    issues = []
    if "guaranteed" in req.content.lower():
        issues.append("Claims of guaranteed results violate FTC guidelines.")
    if "100%" in req.content:
        issues.append("Absolute percentages require substantiation.")
    validated = len(issues) == 0
    return PolicyCheckResponse(validated=validated, issues=issues)

@app.get("/health")
def health_check():
    # Check if the database connection is still alive
    db_status = "ok"
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT 1")
    except psycopg2.Error:
        db_status = "error"

    return {"status": "ok", "database_connection": db_status, "modules": ["Summarizer", "Memory", "PolicyChecker", "Clarify"]}
