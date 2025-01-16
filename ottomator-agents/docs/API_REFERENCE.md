# Nichols AI Agents API Reference

## Knowledge Base Management

### Add Knowledge Base
```http
POST /api/v1/knowledge
Content-Type: application/json

{
  "key": "unique_key",
  "name": "Display Name",
  "url": "https://docs.example.com"
}
```

### Remove Knowledge Base
```http
DELETE /api/v1/knowledge/{key}
```

### List Knowledge Bases
```http
GET /api/v1/knowledge
```

## Documentation Crawling

### Start Crawl
```http
POST /api/v1/crawl
Content-Type: application/json

{
  "url": "https://docs.example.com",
  "depth": 3,
  "max_pages": 100
}
```

### Get Crawl Status
```http
GET /api/v1/crawl/status/{job_id}
```

## Query Interface

### Submit Query
```http
POST /api/v1/query
Content-Type: application/json

{
  "question": "How to use the API?",
  "context": "API documentation"
}
```

### Get Query History
```http
GET /api/v1/query/history
```

## Error Responses
All errors follow this format:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message"
  }
}
```

Common error codes:
- `400`: Bad request
- `401`: Unauthorized
- `404`: Resource not found
- `500`: Internal server error
