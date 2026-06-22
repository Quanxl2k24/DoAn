import Joi from "joi";

export const createPhongSchema = Joi.object({
  rapId: Joi.string().required().messages({
    "any.required": "Rạp chiếu là bắt buộc",
  }),
  tenPhong: Joi.string().required().messages({
    "any.required": "Tên phòng là bắt buộc",
  }),
  soHang: Joi.number().integer().min(1).max(26).optional(),
  soCot: Joi.number().integer().min(1).optional(),
  trangThai: Joi.string().valid("HOAT_DONG", "BAO_TRI", "NGUNG_HOAT_DONG").optional(),
}).options({ allowUnknown: false });

export const updatePhongSchema = Joi.object({
  tenPhong: Joi.string(),
  trangThai: Joi.string().valid("HOAT_DONG", "BAO_TRI", "NGUNG_HOAT_DONG"),
});
