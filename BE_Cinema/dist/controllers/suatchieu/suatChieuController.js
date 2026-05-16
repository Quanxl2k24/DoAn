"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSuatChieu = exports.createSuatChieu = exports.getSuatChieu = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const getSuatChieu = async (req, res) => {
    try {
        const phimId = req.query.phimId;
        const rapId = req.query.rapId;
        const ngay = req.query.ngay;
        const where = {};
        if (phimId)
            where.phimId = phimId;
        if (rapId) {
            where.phong = { rapId };
        }
        if (ngay) {
            const date = new Date(ngay);
            const start = new Date(date.setHours(0, 0, 0, 0));
            const end = new Date(date.setHours(23, 59, 59, 999));
            where.thoiGianBatDau = { gte: start, lte: end };
        }
        const suatChieus = await prisma_1.default.suatChieu.findMany({
            where,
            include: {
                phim: true,
                phong: {
                    include: { rap: true },
                },
                _count: { select: { ves: true } },
            },
            orderBy: { thoiGianBatDau: "asc" },
        });
        // Calculate available seats
        const result = await Promise.all(suatChieus.map(async (sc) => {
            const totalSeats = await prisma_1.default.ghe.count({
                where: { phongId: sc.phongId },
            });
            return {
                ...sc,
                soGheTrong: totalSeats - sc._count.ves,
                soGheDat: sc._count.ves,
            };
        }));
        res.status(200).json({ data: result });
    }
    catch (error) {
        console.error("Get SuatChieu Error:", error);
        res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
    }
};
exports.getSuatChieu = getSuatChieu;
const createSuatChieu = async (req, res) => {
    try {
        const { phimId, phongId, thoiGianBatDau } = req.body;
        const phim = await prisma_1.default.phim.findUnique({ where: { id: phimId } });
        if (!phim) {
            res.status(404).json({ message: "Không tìm thấy phim" });
            return;
        }
        const thoiGianKetThuc = new Date(new Date(thoiGianBatDau).getTime() + phim.thoiLuong * 60000);
        const suatChieu = await prisma_1.default.suatChieu.create({
            data: { phimId, phongId, thoiGianBatDau, thoiGianKetThuc },
        });
        res.status(201).json({ message: "Tạo suất chiếu thành công", data: suatChieu });
    }
    catch (error) {
        console.error("Create SuatChieu Error:", error);
        res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
    }
};
exports.createSuatChieu = createSuatChieu;
const deleteSuatChieu = async (req, res) => {
    try {
        const id = req.params.id;
        const existing = await prisma_1.default.suatChieu.findUnique({ where: { id } });
        if (!existing) {
            res.status(404).json({ message: "Không tìm thấy suất chiếu" });
            return;
        }
        await prisma_1.default.suatChieu.delete({ where: { id } });
        res.status(200).json({ message: "Xoá suất chiếu thành công" });
    }
    catch (error) {
        console.error("Delete SuatChieu Error:", error);
        res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
    }
};
exports.deleteSuatChieu = deleteSuatChieu;
//# sourceMappingURL=suatChieuController.js.map