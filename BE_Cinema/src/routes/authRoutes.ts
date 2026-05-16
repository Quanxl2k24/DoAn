import { Router } from "express";
import { register, login, getMe, refreshToken, logout } from "../controllers/auth/authController";
import { validate } from "../middlewares/validateMiddleware";
import { authenticateToken } from "../middlewares/authMiddleware";
import { registerSchema, loginSchema } from "../validators/authValidator";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API xác thực người dùng
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Đăng ký tài khoản mới
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: test@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *       400:
 *         description: Lỗi dữ liệu đầu vào (Validation Error) hoặc Email đã tồn tại
 */
router.post("/register", validate(registerSchema), register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Đăng nhập
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: test@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123
 *     responses:
 *       200:
 *         description: Đăng nhập thành công, trả về Access Token
 *       400:
 *         description: Lỗi dữ liệu đầu vào
 *       401:
 *         description: Email hoặc mật khẩu không chính xác
 */
router.post("/login", validate(loginSchema), login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Lấy thông tin người dùng hiện tại
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về thông tin người dùng
 *       401:
 *         description: Unauthorized
 */
router.get("/me", authenticateToken, getMe);

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Cấp lại Access Token bằng Refresh Token (qua Cookie)
 *     tags: [Auth]
 *     security: []
 *     responses:
 *       200:
 *         description: Trả về Access Token mới
 *       401:
 *         description: Refresh Token Required
 *       403:
 *         description: Invalid Refresh Token
 */
router.post("/refresh-token", refreshToken);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Đăng xuất (xóa Cookie)
 *     tags: [Auth]
 *     security: []
 *     responses:
 *       200:
 *         description: Đăng xuất thành công
 */
router.post("/logout", logout);

export default router;
