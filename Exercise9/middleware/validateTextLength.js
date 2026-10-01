// Exercise 9 - Exercise 3
// Ensure the article text meets minimum and maximum length requirements.

const validateTextLength = (minLength = 10, maxLength = 1000) => {
  return (req, res, next) => {
    const { text } = req.body;

    if (typeof text !== "string") {
      return res.status(400).json({
        error: "Text must be a string"
      });
    }

    const length = text.trim().length;

    if (length < minLength || length > maxLength) {
      return res.status(400).json({
        error: `Text length must be between ${minLength} and ${maxLength} characters`
      });
    }

    next();
  };
};

module.exports = validateTextLength;