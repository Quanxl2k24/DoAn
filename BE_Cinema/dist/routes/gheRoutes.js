"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gheController_1 = require("../controllers/ghe/gheController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Ghes
 *   description: API quản lý ghế và giữ ghế
 */
// Lấy trạng thái ghế theo suất chiếu (public)
router.get("/trang-thai/:suatChieuId", gheController_1.getTrangThaiGhe);
// Giữ ghế (cần đăng nhập)
router.post("/giu", authMiddleware_1.authenticateToken, gheController_1.giuGhe);
// Hủy giữ ghế
router.post("/huy-giu", authMiddleware_1.authenticateToken, gheController_1.huyGiuGhe);
exports.default = router;
//# sourceMappingURL=gheRoutes.js.map