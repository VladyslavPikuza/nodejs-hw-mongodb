import { HttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  if (err instanceof HttpError) {
    const errorMessage = "Validation error";

    return res.status(err.status).json({
      status: err.status,
      message: errorMessage,
      data: { message: err.message },
    });
  }


  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    data: err.message,
  });
};
