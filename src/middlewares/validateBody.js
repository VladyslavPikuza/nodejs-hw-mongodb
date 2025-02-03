const { validate } = require("joi");

const validateBody = (schema) => {
  return (req, res, next) => {
    if (!req.body) {
      return res.status(400).json({ message: 'Request body is missing' });
    }

    const { error } = validate(req.body, schema, { abortEarly: false });

    if (error) {
      console.error('Validation error:', error.details);
      return res.status(400).json({
        status: 400,
        message: 'Validation error',
        details: error.details.map((detail) => detail.message),
      });
    }

    next();
  };
};

module.exports = validateBody;
