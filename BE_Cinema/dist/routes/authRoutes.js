"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/auth/authController");
const validateMiddleware_1 = require("../middlewares/validateMiddleware");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const authValidator_1 = require("../validators/authValidator");
const router = (0, express_1.Router)();
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
router.post("/register", (0, validateMiddleware_1.validate)(authValidator_1.registerSchema), authController_1.register);
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
router.post("/login", (0, validateMiddleware_1.validate)(authValidator_1.loginSchema), authController_1.login);
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
router.get("/me", authMiddleware_1.authenticateToken, authController_1.getMe);
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
router.post("/refresh-token", authController_1.refreshToken);
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
router.post("/logout", authController_1.logout);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map