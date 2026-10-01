// Exercise 9 - Exercise 2
// Validate date format: YYYY-MM-DD and a real calendar date.

const validateDate = (req, res, next) => {
  const { date } = req.body;

  if (!date) {
    return res.status(400).json({
      error: "Date is required"
    });
  }

  const datePattern = /^\d{4}-\d{2}-\d{2}$/;

  if (!datePattern.test(date)) {
    return res.status(400).json({
      error: "Date must be in YYYY-MM-DD format"
    });
  }

  const parsed = new Date(`${date}T00:00:00Z`);
  const validDate =
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === date;

  if (!validDate) {
    return res.status(400).json({
      error: "Invalid calendar date"
    });
  }

  next();
};

module.exports = validateDate;