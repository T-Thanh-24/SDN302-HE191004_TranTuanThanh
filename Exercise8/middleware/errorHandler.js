// Exercise 8 - Centralized error-handling middleware

const errorHandler = (err, req, res, next) => {
  console.error(err.stack || err.message);

  const statusCode = err.status || 500;

  res.status(statusCode).json({
    error:
      statusCode === 500
        ? "An error occurred, please try again later."
        : err.message
  });
};

module.exports = errorHandler;