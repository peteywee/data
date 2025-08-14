# API Tests (local)

## Start API
```bash
npm i
npm run api
# server on http://localhost:8787
```

## Health
```bash
curl -s http://localhost:8787/health
```

## Web Search
```bash
curl -s 'http://localhost:8787/web/search?q=best%20puppy%20training%20tips'
```

## HTTP GET
```bash
curl -s 'http://localhost:8787/http/get?url=https://example.com'
```

## Gemini Complete
```bash
export GEMINI_API_KEY=YOUR_KEY
curl -s -X POST http://localhost:8787/llm/gemini/complete \
  -H 'content-type: application/json' \
  -d '{"prompt":"List 3 tips for training puppies"}'
```

## Orchestrate Run
```bash
curl -s -X POST http://localhost:8787/orchestrate/run \
  -H 'content-type: application/json' \
  -d '{"task":"Draft a kickoff plan for Pets content hub"}'
```
