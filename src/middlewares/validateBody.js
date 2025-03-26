const createError = require("http-errors");

const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errorMessages = error.details.map((detail) => {
        return `"${detail.context.label}" is required`;
      }).join(", ");
      
      return next(createError(400, errorMessages));
    }

    next();
  };
};

module.exports = validateBody;


