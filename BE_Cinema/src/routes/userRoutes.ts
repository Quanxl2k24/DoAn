import { Router } from "express";
import { updateProfile } from "../controllers/user/userController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API quản lý người dùng
 */

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Cập nhật thông tin cá nhân
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Nguyễn Văn A
 *               phoneNumber:
 *                 type: string
 *                 example: 0987654321
 *     responses:
 *       200:
 *         description: Cập nhật thông tin thành công
 *       401:
 *         description: Unauthorized
 */
router.put("/profile", authenticateToken, updateProfile);

export default router;
