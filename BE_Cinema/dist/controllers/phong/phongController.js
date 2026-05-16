"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePhong = exports.updatePhong = exports.createPhong = exports.getPhongsByRap = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const getPhongsByRap = async (req, res) => {
    try {
        const rapId = req.params.rapId;
        const phongs = await prisma_1.default.phongChieu.findMany({
            where: { rapId },
            include: { ghes: true },
        });
        res.status(200).json({ data: phongs });
    }
    catch (error) {
        console.error("Get Phongs By Rap Error:", error);
        res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
    }
};
exports.getPhongsByRap = getPhongsByRap;
const createPhong = async (req, res) => {
    try {
        const { rapId, tenPhong } = req.body;
        const phong = await prisma_1.default.phongChieu.create({
            data: { rapId, tenPhong },
        });
        res.status(201).json({ message: "Tạo phòng thành công", data: phong });
    }
    catch (error) {
        console.error("Create Phong Error:", error);
        res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
    }
};
exports.createPhong = createPhong;
const updatePhong = async (req, res) => {
    try {
        const id = req.params.id;
        const existing = await prisma_1.default.phongChieu.findUnique({ where: { id } });
        if (!existing) {
            res.status(404).json({ message: "Không tìm thấy phòng" });
            return;
        }
        const phong = await prisma_1.default.phongChieu.update({
            where: { id },
            data: req.body,
        });
        res.status(200).json({ message: "Cập nhật phòng thành công", data: phong });
    }
    catch (error) {
        console.error("Update Phong Error:", error);
        res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
    }
};
exports.updatePhong = updatePhong;
const deletePhong = async (req, res) => {
    try {
        const id = req.params.id;
        const existing = await prisma_1.default.phongChieu.findUnique({ where: { id } });
        if (!existing) {
            res.status(404).json({ message: "Không tìm thấy phòng" });
            return;
        }
        await prisma_1.default.phongChieu.delete({ where: { id } });
        res.status(200).json({ message: "Xoá phòng thành công" });
    }
    catch (error) {
        console.error("Delete Phong Error:", error);
        res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
    }
};
exports.deletePhong = deletePhong;
//# sourceMappingURL=phongController.js.map