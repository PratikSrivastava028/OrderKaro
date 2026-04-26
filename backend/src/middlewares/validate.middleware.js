import ErrorResponse from "../utils/ApiError.util.js";

export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(
      req.body /* { abortEarly: false } */,
    );
    if (error) {
      let errors = error.details.map((err) => err.message);
      return next(new ErrorResponse(errors.join(", "), 400));
    }
    req.body = value;
    next();
  };
};
