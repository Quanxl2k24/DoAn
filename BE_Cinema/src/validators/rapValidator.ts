import Joi from "joi";

export const createRapSchema = Joi.object({
  tenRap: Joi.string().required().messages({
    "any.required": "Tên rạp là bắt buộc",
  }),
  diaChi: Joi.string().required().messages({
    "any.required": "Địa chỉ là bắt buộc",
  }),
});

export const updateRapSchema = Joi.object({
  tenRap: Joi.string(),
  diaChi: Joi.string(),
  trangThai: Joi.string().valid("HOAT_DONG", "NGUNG_HOAT_DONG"),
});
