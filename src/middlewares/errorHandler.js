export const errorHandler = (err, req, res, next) => {
  let errorMessage = err.name;

  if (err.status === 400) {
    errorMessage = "Validation error";
  }

  res.status(err.status || 500).json({
    status: err.status || 500,
    message: errorMessage,
    data: { message: err.message },
  });
};