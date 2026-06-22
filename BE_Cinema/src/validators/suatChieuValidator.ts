import Joi from "joi";

export const createSuatChieuSchema = Joi.object({
  phimId: Joi.string().required().messages({
    "any.required": "Phim là bắt buộc",
  }),
  phongId: Joi.string().required().messages({
    "any.required": "Phòng chiếu là bắt buộc",
  }),
  thoiGianBatDau: Joi.date().iso().required().messages({
    "any.required": "Thời gian bắt đầu là bắt buộc",
    "date.format": "Thời gian không đúng định dạng ISO",
  }),
  giaSuatChieu: Joi.number().optional(),
  heSoGia: Joi.number().min(0.5).max(3.0).optional().messages({
    "number.min": "Hệ số giá không được nhỏ hơn 0.5",
    "number.max": "Hệ số giá không được lớn hơn 3.0",
  }),
});
