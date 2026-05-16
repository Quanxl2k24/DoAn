import Joi from "joi";

export const createPhimSchema = Joi.object({
  tenPhim: Joi.string().required().messages({
    "any.required": "Tên phim là bắt buộc",
  }),
  moTa: Joi.string().required().messages({
    "any.required": "Mô tả là bắt buộc",
  }),
  posterUrl: Joi.string().uri().required().messages({
    "any.required": "Poster URL là bắt buộc",
    "string.uri": "Poster URL không hợp lệ",
  }),
  backdropUrl: Joi.string().uri().allow("", null),
  trailerUrl: Joi.string().uri().allow("", null),
  thoiLuong: Joi.number().integer().min(1).required().messages({
    "any.required": "Thời lượng là bắt buộc",
  }),
  ngayKhoiChieu: Joi.date().required().messages({
    "any.required": "Ngày khởi chiếu là bắt buộc",
  }),
  theLoai: Joi.string().required().messages({
    "any.required": "Thể loại là bắt buộc",
  }),
  ngonNgu: Joi.string().required().messages({
    "any.required": "Ngôn ngữ là bắt buộc",
  }),
  daoDien: Joi.string().allow("", null),
  dienVien: Joi.string().allow("", null),
  phanLoaiTuoi: Joi.string().required().messages({
    "any.required": "Phân loại tuổi là bắt buộc",
  }),
  giaCoBan: Joi.number().min(0).required().messages({
    "any.required": "Giá cơ bản là bắt buộc",
  }),
  trangThai: Joi.string()
    .valid("DANG_CHIEU", "SAP_CHIEU", "NGUNG_CHIEU")
    .default("DANG_CHIEU"),
});

export const updatePhimSchema = Joi.object({
  tenPhim: Joi.string(),
  moTa: Joi.string(),
  posterUrl: Joi.string().uri(),
  backdropUrl: Joi.string().uri().allow("", null),
  trailerUrl: Joi.string().uri().allow("", null),
  thoiLuong: Joi.number().integer().min(1),
  ngayKhoiChieu: Joi.date(),
  theLoai: Joi.string(),
  ngonNgu: Joi.string(),
  daoDien: Joi.string().allow("", null),
  dienVien: Joi.string().allow("", null),
  phanLoaiTuoi: Joi.string(),
  giaCoBan: Joi.number().min(0),
  trangThai: Joi.string().valid("DANG_CHIEU", "SAP_CHIEU", "NGUNG_CHIEU"),
});