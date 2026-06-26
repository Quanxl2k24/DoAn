import { Router } from "express";
import {
  getAnalytics,
  getRevenueChart,
  getWeeklyRevenue,
  getTopMovies,
} from "../controllers/admin/adminController";
import { createNgayLe, deleteNgayLe } from "../controllers/ngayLeController";
import { authenticateToken } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/roleMiddleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: API quản trị hệ thống
 */

/**
 * @swagger
 * /api/admin/analytics:
 *   get:
 *     summary: Thống kê tổng quan (Admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 7
 *     responses:
 *       200:
 *         description: Dữ liệu thống kê
 */
router.get("/analytics", authenticateToken, requireRole("ADMIN"), getAnalytics);

/**
 * @swagger
 * /api/admin/analytics/revenue-chart:
 *   get:
 *     summary: Dữ liệu biểu đồ doanh thu (Admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 7
 *     responses:
 *       200:
 *         description: Dữ liệu biểu đồ
 */
router.get("/analytics/revenue-chart", authenticateToken, requireRole("ADMIN"), getRevenueChart);

/**
 * @swagger
 * /api/admin/analytics/weekly-revenue:
 *   get:
 *     summary: Doanh thu 7 ngày trong tuần hiện tại (Admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Doanh thu từng ngày trong tuần
 */
router.get("/analytics/weekly-revenue", authenticateToken, requireRole("ADMIN"), getWeeklyRevenue);

/**
 * @swagger
 * /api/admin/analytics/top-movies:
 *   get:
 *     summary: Top phim bán chạy (Admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 7
 *     responses:
 *       200:
 *         description: Top phim
 */
router.get("/analytics/top-movies", authenticateToken, requireRole("ADMIN"), getTopMovies);

router.post("/ngay-les", authenticateToken, requireRole("ADMIN"), createNgayLe);
router.delete("/ngay-les/:id", authenticateToken, requireRole("ADMIN"), deleteNgayLe);

export default router;
