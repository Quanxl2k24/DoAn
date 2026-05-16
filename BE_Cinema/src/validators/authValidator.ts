import Joi from "joi";

// Mật khẩu ít nhất 8 ký tự, có chữ hoa và chữ thường
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

export const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Email không đúng định dạng hợp lệ",
    "any.required": "Email là bắt buộc",
  }),
  password: Joi.string().pattern(passwordRegex).required().messages({
    "string.pattern.base": "Mật khẩu phải có ít nhất 8 ký tự, bao gồm ít nhất một chữ hoa và một chữ thường",
    "any.required": "Mật khẩu là bắt buộc",
  }),
  fullName: Joi.string().allow("", null),
  phoneNumber: Joi.string().allow("", null),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Email không đúng định dạng hợp lệ",
    "any.required": "Email là bắt buộc",
  }),
  password: Joi.string().required().messages({
    "any.required": "Mật khẩu là bắt buộc",
  }),
});
