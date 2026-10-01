const express = require("express");

const articleRouter = require("./routers/articleRouter");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const port = 3000;

// Parse JSON request body
app.use(express.json());

// Routers
app.use("/articles", articleRouter);

// 404 handler for unknown routes
app.use((req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.status = 404;
  next(error);
});

// Centralized error-handling middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});