import { Router } from "express";
import {
  getAllPhim,
  getPhimById,
  createPhim,
  updatePhim,
  deletePhim,
} from "../controllers/phim/phimController";
import { authenticateToken } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/roleMiddleware";
import { validate } from "../middlewares/validateMiddleware";
import { createPhimSchema, updatePhimSchema } from "../validators/phimValidator";

const router = Router();

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
router.get("/", getAllPhim);

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
router.get("/:id", getPhimById);

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
router.post(
  "/",
  authenticateToken,
  requireRole("ADMIN"),
  validate(createPhimSchema),
  createPhim
);

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
router.put(
  "/:id",
  authenticateToken,
  requireRole("ADMIN"),
  validate(updatePhimSchema),
  updatePhim
);

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
router.delete(
  "/:id",
  authenticateToken,
  requireRole("ADMIN"),
  deletePhim
);

export default router;