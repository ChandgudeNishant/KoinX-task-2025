// middlewares/validationMiddleware.js
const validateRequest = (schema, source = 'body') => (req, res, next) => {
    const { error } = schema.validate(req[source], { abortEarly: false });
    if (error) {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            details: error.details.map((err) => err.message),
        });
    }
    next();
};

module.exports = validateRequest;
