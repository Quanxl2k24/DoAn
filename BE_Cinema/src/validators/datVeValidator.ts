import Joi from "joi";

export const datVeSchema = Joi.object({
  suatChieuId: Joi.string().uuid().required().messages({
    "any.required": "Suất chiếu là bắt buộc",
    "string.guid": "Mã suất chiếu không hợp lệ",
  }),
  gheIds: Joi.array().items(Joi.string().uuid()).min(1).required().messages({
    "any.required": "Ghế là bắt buộc",
    "array.min": "Phải chọn ít nhất 1 ghế",
  }),
  phuongThuc: Joi.string()
    .valid("VNPAY", "MOMO", "ZALOPAY", "CARD", "ATM")
    .required()
    .messages({
      "any.required": "Phương thức thanh toán là bắt buộc",
      "any.only": "Phương thức thanh toán không hợp lệ",
    }),
});
