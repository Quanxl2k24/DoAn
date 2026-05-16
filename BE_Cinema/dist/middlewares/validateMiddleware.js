"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errorMessage = error.details.map((details) => details.message).join(", ");
            res.status(400).json({ error: errorMessage });
            return;
        }
        next();
    };
};
exports.validate = validate;
//# sourceMappingURL=validateMiddleware.js.map