"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const requireRole = (...roles) => {
    return async (req, res, next) => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }
            const user = await prisma_1.default.user.findUnique({
                where: { id: userId },
                include: { role: true },
            });
            if (!user || !roles.includes(user.role.name)) {
                res.status(403).json({ message: "Bạn không có quyền thực hiện hành động này" });
                return;
            }
            next();
        }
        catch (error) {
            console.error("Role Middleware Error:", error);
            res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
        }
    };
};
exports.requireRole = requireRole;
//# sourceMappingURL=roleMiddleware.js.map