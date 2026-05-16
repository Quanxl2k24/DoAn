"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePhimSchema = exports.createPhimSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createPhimSchema = joi_1.default.object({
    tenPhim: joi_1.default.string().required().messages({
        "any.required": "Tên phim là bắt buộc",
    }),
    moTa: joi_1.default.string().required().messages({
        "any.required": "Mô tả là bắt buộc",
    }),
    posterUrl: joi_1.default.string().uri().required().messages({
        "any.required": "Poster URL là bắt buộc",
        "string.uri": "Poster URL không hợp lệ",
    }),
    backdropUrl: joi_1.default.string().uri().allow("", null),
    trailerUrl: joi_1.default.string().uri().allow("", null),
    thoiLuong: joi_1.default.number().integer().min(1).required().messages({
        "any.required": "Thời lượng là bắt buộc",
    }),
    ngayKhoiChieu: joi_1.default.date().required().messages({
        "any.required": "Ngày khởi chiếu là bắt buộc",
    }),
    theLoai: joi_1.default.string().required().messages({
        "any.required": "Thể loại là bắt buộc",
    }),
    ngonNgu: joi_1.default.string().required().messages({
        "any.required": "Ngôn ngữ là bắt buộc",
    }),
    daoDien: joi_1.default.string().allow("", null),
    dienVien: joi_1.default.string().allow("", null),
    phanLoaiTuoi: joi_1.default.string().required().messages({
        "any.required": "Phân loại tuổi là bắt buộc",
    }),
    giaCoBan: joi_1.default.number().min(0).required().messages({
        "any.required": "Giá cơ bản là bắt buộc",
    }),
    trangThai: joi_1.default.string()
        .valid("DANG_CHIEU", "SAP_CHIEU", "NGUNG_CHIEU")
        .default("DANG_CHIEU"),
});
exports.updatePhimSchema = joi_1.default.object({
    tenPhim: joi_1.default.string(),
    moTa: joi_1.default.string(),
    posterUrl: joi_1.default.string().uri(),
    backdropUrl: joi_1.default.string().uri().allow("", null),
    trailerUrl: joi_1.default.string().uri().allow("", null),
    thoiLuong: joi_1.default.number().integer().min(1),
    ngayKhoiChieu: joi_1.default.date(),
    theLoai: joi_1.default.string(),
    ngonNgu: joi_1.default.string(),
    daoDien: joi_1.default.string().allow("", null),
    dienVien: joi_1.default.string().allow("", null),
    phanLoaiTuoi: joi_1.default.string(),
    giaCoBan: joi_1.default.number().min(0),
    trangThai: joi_1.default.string().valid("DANG_CHIEU", "SAP_CHIEU", "NGUNG_CHIEU"),
});
//# sourceMappingURL=phimValidator.js.map