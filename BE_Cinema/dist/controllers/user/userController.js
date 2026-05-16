"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const updateProfile = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ message: "Không tìm thấy thông tin xác thực" });
            return;
        }
        const { fullName, phoneNumber } = req.body;
        const updatedUser = await prisma_1.default.user.update({
            where: { id: userId },
            data: {
                fullName,
                phoneNumber,
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                phoneNumber: true,
                roleId: true,
            },
        });
        res.status(200).json({
            message: "Cập nhật thông tin thành công",
            user: updatedUser,
        });
    }
    catch (error) {
        console.error("Update Profile Error:", error);
        res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
    }
};
exports.updateProfile = updateProfile;
//# sourceMappingURL=userController.js.map