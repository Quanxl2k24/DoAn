"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePhim = exports.updatePhim = exports.createPhim = exports.getPhimById = exports.getAllPhim = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const getAllPhim = async (req, res) => {
    try {
        const trangThai = req.query.trangThai;
        const page = req.query.page ?? '1';
        const limit = req.query.limit ?? '10';
        const skip = (Number(page) - 1) * Number(limit);
        const where = {};
        if (trangThai)
            where.trangThai = trangThai;
        const [phims, total] = await Promise.all([
            prisma_1.default.phim.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy: { ngayKhoiChieu: "desc" },
            }),
            prisma_1.default.phim.count({ where }),
        ]);
        res.status(200).json({
            data: phims,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages: Math.ceil(total / Number(limit)),
            },
        });
    }
    catch (error) {
        console.error("Get All Phim Error:", error);
        res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
    }
};
exports.getAllPhim = getAllPhim;
const getPhimById = async (req, res) => {
    try {
        const id = req.params.id;
        const phim = await prisma_1.default.phim.findUnique({ where: { id } });
        if (!phim) {
            res.status(404).json({ message: "Không tìm thấy phim" });
            return;
        }
        res.status(200).json({ data: phim });
    }
    catch (error) {
        console.error("Get Phim By Id Error:", error);
        res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
    }
};
exports.getPhimById = getPhimById;
const createPhim = async (req, res) => {
    try {
        const data = req.body;
        const phim = await prisma_1.default.phim.create({ data });
        res.status(201).json({ message: "Tạo phim thành công", data: phim });
    }
    catch (error) {
        console.error("Create Phim Error:", error);
        res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
    }
};
exports.createPhim = createPhim;
const updatePhim = async (req, res) => {
    try {
        const id = req.params.id;
        const existing = await prisma_1.default.phim.findUnique({ where: { id } });
        if (!existing) {
            res.status(404).json({ message: "Không tìm thấy phim" });
            return;
        }
        const phim = await prisma_1.default.phim.update({
            where: { id },
            data: req.body,
        });
        res.status(200).json({ message: "Cập nhật phim thành công", data: phim });
    }
    catch (error) {
        console.error("Update Phim Error:", error);
        res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
    }
};
exports.updatePhim = updatePhim;
const deletePhim = async (req, res) => {
    try {
        const id = req.params.id;
        const existing = await prisma_1.default.phim.findUnique({ where: { id } });
        if (!existing) {
            res.status(404).json({ message: "Không tìm thấy phim" });
            return;
        }
        await prisma_1.default.phim.delete({ where: { id } });
        res.status(200).json({ message: "Xoá phim thành công" });
    }
    catch (error) {
        console.error("Delete Phim Error:", error);
        res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
    }
};
exports.deletePhim = deletePhim;
//# sourceMappingURL=phimController.js.map