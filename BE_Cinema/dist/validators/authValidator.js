"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
// Mật khẩu ít nhất 8 ký tự, có chữ hoa và chữ thường
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
exports.registerSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        "string.email": "Email không đúng định dạng hợp lệ",
        "any.required": "Email là bắt buộc",
    }),
    password: joi_1.default.string().pattern(passwordRegex).required().messages({
        "string.pattern.base": "Mật khẩu phải có ít nhất 8 ký tự, bao gồm ít nhất một chữ hoa và một chữ thường",
        "any.required": "Mật khẩu là bắt buộc",
    }),
    fullName: joi_1.default.string().allow("", null),
    phoneNumber: joi_1.default.string().allow("", null),
});
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        "string.email": "Email không đúng định dạng hợp lệ",
        "any.required": "Email là bắt buộc",
    }),
    password: joi_1.default.string().required().messages({
        "any.required": "Mật khẩu là bắt buộc",
    }),
});
//# sourceMappingURL=authValidator.js.map