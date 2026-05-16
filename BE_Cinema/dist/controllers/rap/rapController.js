"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRap = exports.updateRap = exports.createRap = exports.getRapById = exports.getAllRaps = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const getAllRaps = async (req, res) => {
    try {
        const raps = await prisma_1.default.rapChieu.findMany({
            include: { phongChieus: true },
        });
        res.status(200).json({ data: raps });
    }
    catch (error) {
        console.error("Get All Raps Error:", error);
        res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
    }
};
exports.getAllRaps = getAllRaps;
const getRapById = async (req, res) => {
    try {
        const id = req.params.id;
        const rap = await prisma_1.default.rapChieu.findUnique({
            where: { id },
            include: { phongChieus: true },
        });
        if (!rap) {
            res.status(404).json({ message: "Không tìm thấy rạp" });
            return;
        }
        res.status(200).json({ data: rap });
    }
    catch (error) {
        console.error("Get Rap By Id Error:", error);
        res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
    }
};
exports.getRapById = getRapById;
const createRap = async (req, res) => {
    try {
        const { tenRap, diaChi } = req.body;
        const rap = await prisma_1.default.rapChieu.create({
            data: { tenRap, diaChi },
        });
        res.status(201).json({ message: "Tạo rạp thành công", data: rap });
    }
    catch (error) {
        console.error("Create Rap Error:", error);
        res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
    }
};
exports.createRap = createRap;
const updateRap = async (req, res) => {
    try {
        const id = req.params.id;
        const existing = await prisma_1.default.rapChieu.findUnique({ where: { id } });
        if (!existing) {
            res.status(404).json({ message: "Không tìm thấy rạp" });
            return;
        }
        const rap = await prisma_1.default.rapChieu.update({
            where: { id },
            data: req.body,
        });
        res.status(200).json({ message: "Cập nhật rạp thành công", data: rap });
    }
    catch (error) {
        console.error("Update Rap Error:", error);
        res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
    }
};
exports.updateRap = updateRap;
const deleteRap = async (req, res) => {
    try {
        const id = req.params.id;
        const existing = await prisma_1.default.rapChieu.findUnique({ where: { id } });
        if (!existing) {
            res.status(404).json({ message: "Không tìm thấy rạp" });
            return;
        }
        await prisma_1.default.rapChieu.delete({ where: { id } });
        res.status(200).json({ message: "Xoá rạp thành công" });
    }
    catch (error) {
        console.error("Delete Rap Error:", error);
        res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
    }
};
exports.deleteRap = deleteRap;
//# sourceMappingURL=rapController.js.map