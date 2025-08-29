# FastAPI Hierarchical Reasoning Assistant

## Features
- Summarizer (/execution/summarize)
- Memory with SQLite persistence (/memory/save, /memory/recall)
- Policy Checker (/validation/policycheck)
- Clarification (/strategic/clarify)
- Health check (/health)
- Redirects / to Swagger UI (/docs)
- Custom welcome route (/welcome)

## Setup
```bash
docker-compose up --build
```

## Testing
- Health check: curl http://localhost:8000/health
- Swagger UI: http://localhost:8000/docs
