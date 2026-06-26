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
  apDungPhuPhiCuoiTuan: Joi.boolean().optional(),
  apDungPhuPhiNgayLe: Joi.boolean().optional(),
  apDungPhuPhiTheoGio: Joi.boolean().optional(),
});
