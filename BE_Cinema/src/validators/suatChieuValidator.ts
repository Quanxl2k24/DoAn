import Joi from "joi";

export const createSuatChieuSchema = Joi.object({
  phimId: Joi.string().uuid().required().messages({
    "any.required": "Phim là bắt buộc",
    "string.guid": "Mã phim không hợp lệ",
  }),
  phongId: Joi.string().uuid().required().messages({
    "any.required": "Phòng chiếu là bắt buộc",
    "string.guid": "Mã phòng không hợp lệ",
  }),
  thoiGianBatDau: Joi.date().iso().required().messages({
    "any.required": "Thời gian bắt đầu là bắt buộc",
    "date.format": "Thời gian không đúng định dạng ISO",
  }),
  giaSuatChieu: Joi.number().optional(),
});
