"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.huyGiuGhe = exports.giuGhe = exports.getTrangThaiGhe = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const getTrangThaiGhe = async (req, res) => {
    try {
        const suatChieuId = req.params.suatChieuId;
        const suatChieu = await prisma_1.default.suatChieu.findUnique({
            where: { id: suatChieuId },
            include: {
                phong: {
                    include: {
                        ghes: {
                            include: { loaiGhe: true },
                            orderBy: [{ hang: "asc" }, { cot: "asc" }],
                        },
                    },
                },
            },
        });
        if (!suatChieu) {
            res.status(404).json({ message: "Không tìm thấy suất chiếu" });
            return;
        }
        // Get locked seats
        const lockedSeats = await prisma_1.default.giuGhe.findMany({
            where: {
                suatChieuId,
                trangThai: "DANG_GIU",
                thoiGianHetHan: { gte: new Date() },
            },
            select: { gheId: true },
        });
        // Get booked seats
        const bookedSeats = await prisma_1.default.ve.findMany({
            where: {
                suatChieuId,
                trangThai: "DA_DAT",
            },
            select: { gheId: true },
        });
        const lockedGheIds = new Set(lockedSeats.map((s) => s.gheId));
        const bookedGheIds = new Set(bookedSeats.map((s) => s.gheId));
        const ghes = suatChieu.phong.ghes.map((ghe) => ({
            id: ghe.id,
            tenGhe: ghe.tenGhe,
            hang: ghe.hang,
            cot: ghe.cot,
            loaiGhe: ghe.loaiGhe.tenLoai,
            phuPhi: ghe.loaiGhe.phuPhi,
            trangThaiGhe: ghe.trangThai,
            trangThai: bookedGheIds.has(ghe.id)
                ? "DA_BAN"
                : lockedGheIds.has(ghe.id)
                    ? "DANG_GIU"
                    : "TRONG",
        }));
        res.status(200).json({
            data: {
                suatChieu: {
                    id: suatChieu.id,
                    thoiGianBatDau: suatChieu.thoiGianBatDau,
                    thoiGianKetThuc: suatChieu.thoiGianKetThuc,
                },
                phong: {
                    id: suatChieu.phong.id,
                    tenPhong: suatChieu.phong.tenPhong,
                },
                ghes,
            },
        });
    }
    catch (error) {
        console.error("Get TrangThai Ghe Error:", error);
        res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
    }
};
exports.getTrangThaiGhe = getTrangThaiGhe;
const giuGhe = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const { suatChieuId, gheIds } = req.body;
        // Check showtime exists
        const suatChieu = await prisma_1.default.suatChieu.findUnique({
            where: { id: suatChieuId },
        });
        if (!suatChieu) {
            res.status(404).json({ message: "Không tìm thấy suất chiếu" });
            return;
        }
        // Check if any seats are already booked or locked
        const booked = await prisma_1.default.ve.findMany({
            where: {
                suatChieuId,
                gheId: { in: gheIds },
                trangThai: "DA_DAT",
            },
        });
        if (booked.length > 0) {
            res.status(400).json({
                message: `Ghế ${booked.map((v) => v.gheId).join(", ")} đã được đặt`,
            });
            return;
        }
        const existingLocks = await prisma_1.default.giuGhe.findMany({
            where: {
                suatChieuId,
                gheId: { in: gheIds },
                trangThai: "DANG_GIU",
                thoiGianHetHan: { gte: new Date() },
                userId: { not: userId },
            },
        });
        if (existingLocks.length > 0) {
            res.status(400).json({
                message: "Một số ghế đang được giữ bởi người khác",
            });
            return;
        }
        // Release old locks for this user + showtime
        await prisma_1.default.giuGhe.updateMany({
            where: { suatChieuId, userId, trangThai: "DANG_GIU" },
            data: { trangThai: "HET_HAN" },
        });
        // Create new locks
        const thoiGianHetHan = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
        const giuGhes = await Promise.all(gheIds.map((gheId) => prisma_1.default.giuGhe.create({
            data: {
                gheId,
                suatChieuId,
                userId,
                thoiGianHetHan,
            },
        })));
        res.status(200).json({
            message: "Giữ ghế thành công",
            data: giuGhes,
            hetHanLuc: thoiGianHetHan,
        });
    }
    catch (error) {
        console.error("Giu Ghe Error:", error);
        res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
    }
};
exports.giuGhe = giuGhe;
const huyGiuGhe = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const { suatChieuId } = req.body;
        await prisma_1.default.giuGhe.updateMany({
            where: { suatChieuId, userId, trangThai: "DANG_GIU" },
            data: { trangThai: "HET_HAN" },
        });
        res.status(200).json({ message: "Hủy giữ ghế thành công" });
    }
    catch (error) {
        console.error("Huy Giu Ghe Error:", error);
        res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
    }
};
exports.huyGiuGhe = huyGiuGhe;
//# sourceMappingURL=gheController.js.map