"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const phimController_1 = require("../controllers/phim/phimController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const validateMiddleware_1 = require("../middlewares/validateMiddleware");
const phimValidator_1 = require("../validators/phimValidator");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Phims
 *   description: API quản lý phim
 */
/**
 * @swagger
 * /api/phims:
 *   get:
 *     summary: Lấy danh sách phim
 *     tags: [Phims]
 *     parameters:
 *       - in: query
 *         name: trangThai
 *         schema:
 *           type: string
 *           enum: [DANG_CHIEU, SAP_CHIEU, NGUNG_CHIEU]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Danh sách phim
 */
router.get("/", phimController_1.getAllPhim);
/**
 * @swagger
 * /api/phims/{id}:
 *   get:
 *     summary: Lấy chi tiết phim
 *     tags: [Phims]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chi tiết phim
 */
router.get("/:id", phimController_1.getPhimById);
/**
 * @swagger
 * /api/phims:
 *   post:
 *     summary: Tạo phim mới (Admin)
 *     tags: [Phims]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tenPhim
 *               - moTa
 *               - posterUrl
 *               - thoiLuong
 *               - ngayKhoiChieu
 *               - theLoai
 *               - ngonNgu
 *               - phanLoaiTuoi
 *               - giaCoBan
 *     responses:
 *       201:
 *         description: Tạo phim thành công
 */
router.post("/", authMiddleware_1.authenticateToken, (0, roleMiddleware_1.requireRole)("ADMIN"), (0, validateMiddleware_1.validate)(phimValidator_1.createPhimSchema), phimController_1.createPhim);
/**
 * @swagger
 * /api/phims/{id}:
 *   put:
 *     summary: Cập nhật phim (Admin)
 *     tags: [Phims]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Cập nhật phim thành công
 */
router.put("/:id", authMiddleware_1.authenticateToken, (0, roleMiddleware_1.requireRole)("ADMIN"), (0, validateMiddleware_1.validate)(phimValidator_1.updatePhimSchema), phimController_1.updatePhim);
/**
 * @swagger
 * /api/phims/{id}:
 *   delete:
 *     summary: Xoá phim (Admin)
 *     tags: [Phims]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Xoá phim thành công
 */
router.delete("/:id", authMiddleware_1.authenticateToken, (0, roleMiddleware_1.requireRole)("ADMIN"), phimController_1.deletePhim);
exports.default = router;
//# sourceMappingURL=phimRoutes.js.map