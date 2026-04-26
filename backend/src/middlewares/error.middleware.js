export const errorHandler = (err, req, res, next) => {
  err.message = err.message || "Something went wrong";
  err.statusCode = err.statusCode || 500;

  if (err.name === "ValidationError") {
    err.statusCode = 400;
    err.message = `${Object.values(err.errors)
      .map((value) => value.message)
      .join(", ")}`;
  } else if (err.code === 11000) {
    let key = Object.keys(err.keyValue);
    key = key[0].toUpperCase();
    err.statusCode = 409;
    err.message = `${key} already exists`;
  } else if (err.name === "CastError") {
    err.statusCode = 400;
    err.message = `Invalid ${err.path}: ${err.value}`;
  } else if (err.name === "MulterError") {
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      err.statusCode = 400;
      err.message = "You can only upload one image";
    } else if (err.code === "LIMIT_FILE_SIZE") {
      err.statusCode = 400;
      err.message = "File size should be less than 1MB";
    }
  } else if (err.name === "JsonWebTokenError") {
    err.statusCode = 401;
    err.message = "Invalid token, Please login again!";
  }

  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
    errObject: err,
    errLine: err.stack,
  });
};
