function errorHandler(err, req, res, next) {
  console.error('❌ Server Error:', err);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  return res.status(statusCode).json({
    success: false,
    error: err.message || 'An unexpected internal error occurred on the server.',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
}

module.exports = errorHandler;
