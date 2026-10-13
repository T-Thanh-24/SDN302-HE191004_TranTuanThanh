function sendError(res, status, message) {
  return res.status(status).json({ success: false, message });
}

function handleMongooseError(error, res) {
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0] || 'field';
    return sendError(res, 409, `${field} already exists`);
  }
  if (error.name === 'ValidationError' || error.name === 'CastError') {
    return sendError(res, 400, error.message);
  }
  return sendError(res, 500, error.message || 'Internal server error');
}

module.exports = { sendError, handleMongooseError };
