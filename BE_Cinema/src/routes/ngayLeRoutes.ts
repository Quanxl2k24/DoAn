import { Router } from "express";
import { getAllNgayLe } from "../controllers/ngayLeController";

const router = Router();

/**
 * @swagger
 * /api/ngay-les:
 *   get:
 *     summary: Danh sách ngày lễ
 *     tags: [NgayLe]
 *     responses:
 *       200:
 *         description: Danh sách ngày lễ
 */
router.get("/", getAllNgayLe);

export default router;
