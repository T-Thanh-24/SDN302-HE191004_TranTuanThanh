// Exercise 9 - Exercise 1
// Validate the required fields of an article request body.

const validateArticle = (req, res, next) => {
  try {
    const { title, date, text } = req.body;

    if (!title || !date || !text) {
      return res.status(400).json({
        error: "Missing required fields"
      });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Error validating article"
    });
  }
};

module.exports = validateArticle;