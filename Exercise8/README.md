# Exercise 8 - Handling Errors

## Run
```bash
npm install
npm start
```

Server: http://localhost:3000

## Files
- app.js
- routers/articleRouter.js
- routers/videoRouter.js
- middleware/errorHandler.js

## Postman tests

### 1. GET all articles
GET http://localhost:3000/articles

Expected: 200

### 2. POST article successfully
POST http://localhost:3000/articles

Body -> raw -> JSON:
```json
{
  "title": "My Favorite Vacation",
  "date": "2023-06-02",
  "text": "We spent seven days in Italy and visited Rome."
}
```

Expected: 201

### 3. Trigger 500 error
POST http://localhost:3000/articles

```json
{
  "title": "ERROR",
  "date": "2023-06-02",
  "text": "This request intentionally triggers an error."
}
```

Expected: 500

Response:
```json
{
  "error": "An error occurred, please try again later."
}
```

### 4. Article not found
GET http://localhost:3000/articles/999

Expected: 404

### 5. Video missing fields
POST http://localhost:3000/videos

```json
{
  "title": "Express Middleware"
}
```

Expected: 400

### 6. Video server error
POST http://localhost:3000/videos

```json
{
  "title": "ERROR",
  "description": "This request intentionally triggers an error."
}
```

Expected: 500

The project demonstrates `next(error)` and centralized error-handling middleware.
