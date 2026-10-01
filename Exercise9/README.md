# Exercise 9 - Custom Middleware

## Run
```bash
npm install
npm start
```

Server: http://localhost:3000

## Middleware files
- middleware/validateArticle.js
- middleware/validateDate.js
- middleware/validateTextLength.js

## Exercise 1 - Validate article body

POST http://localhost:3000/articles

```json
{
  "title": "My Favorite Vacation",
  "date": "2023-06-02"
}
```

Expected: 400
```json
{
  "error": "Missing required fields"
}
```

## Exercise 2 - Validate date format

POST http://localhost:3000/articles

```json
{
  "title": "Date Test",
  "date": "06-02-2023",
  "text": "This text is long enough for validation."
}
```

Expected: 400

Correct format:
```json
"date": "2023-06-02"
```

## Exercise 3 - Validate text length

POST http://localhost:3000/articles

```json
{
  "title": "Short Text",
  "date": "2023-06-02",
  "text": "Short"
}
```

Expected: 400

The middleware requires text from 10 to 1000 characters.

## Successful request

POST http://localhost:3000/articles

```json
{
  "title": "Learning Node.js",
  "date": "2026-09-01",
  "text": "This article contains enough characters to pass the text length validation."
}
```

Expected: 201

For POST/PUT requests in Postman: Body -> raw -> JSON.
