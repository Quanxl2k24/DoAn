"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refreshToken = exports.getMe = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../../config/prisma"));
const jwt_1 = require("../../utils/jwt");
const register = async (req, res) => {
    try {
        const { email, password, fullName, phoneNumber } = req.body;
        // Kiểm tra xem email đã tồn tại chưa
        const existingUser = await prisma_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: "Email đã được sử dụng" });
            return;
        }
        // Tìm hoặc tạo Role mặc định là "USER"
        let role = await prisma_1.default.role.findUnique({ where: { name: "USER" } });
        if (!role) {
            role = await prisma_1.default.role.create({ data: { name: "USER" } });
        }
        // Mã hóa mật khẩu
        const salt = await bcrypt_1.default.genSalt(10);
        const hashedPassword = await bcrypt_1.default.hash(password, salt);
        // Lưu user vào DB
        const newUser = await prisma_1.default.user.create({
            data: {
                email,
                password: hashedPassword,
                fullName: fullName || null,
                phoneNumber: phoneNumber || null,
                roleId: role.id,
            },
        });
        res.status(201).json({
            message: "Đăng ký thành công",
            user: {
                id: newUser.id,
                email: newUser.email,
                roleId: newUser.roleId,
            },
        });
    }
    catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Tìm user theo email kèm theo thông tin role
        const user = await prisma_1.default.user.findUnique({
            where: { email },
            include: { role: true }
        });
        if (!user) {
            res.status(401).json({ message: "Email hoặc mật khẩu không chính xác" });
            return;
        }
        // So sánh mật khẩu
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Email hoặc mật khẩu không chính xác" });
            return;
        }
        // Tạo JWT
        const token = (0, jwt_1.generateToken)({
            userId: user.id,
            roleId: user.roleId,
        });
        const refreshToken = (0, jwt_1.generateRefreshToken)({
            userId: user.id,
            roleId: user.roleId,
        });
        // Lưu refresh token vào DB
        await prisma_1.default.user.update({
            where: { id: user.id },
            data: { refreshToken },
        });
        // Set cookie cho refresh token (HttpOnly, Secure)
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
        });
        res.status(200).json({
            message: "Đăng nhập thành công",
            accessToken: token,
            user: {
                id: user.id,
                email: user.email,
                roleId: user.roleId,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
    }
};
exports.login = login;
const getMe = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ message: "Không tìm thấy thông tin xác thực" });
            return;
        }
        const user = await prisma_1.default.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                fullName: true,
                phoneNumber: true,
                roleId: true,
                createdAt: true,
                role: {
                    select: {
                        name: true,
                    }
                }
            },
        });
        if (!user) {
            res.status(404).json({ message: "Không tìm thấy người dùng" });
            return;
        }
        res.status(200).json({ user });
    }
    catch (error) {
        console.error("Get Me Error:", error);
        res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
    }
};
exports.getMe = getMe;
const refreshToken = async (req, res) => {
    try {
        const rfToken = req.cookies.refreshToken;
        if (!rfToken) {
            res.status(401).json({ message: "Refresh Token Required" });
            return;
        }
        // Verify token
        const decoded = (0, jwt_1.verifyRefreshToken)(rfToken);
        // Kiểm tra DB xem token có khớp không (để phòng trường hợp bị thu hồi)
        const user = await prisma_1.default.user.findUnique({ where: { id: decoded.userId } });
        if (!user || user.refreshToken !== rfToken) {
            res.status(403).json({ message: "Invalid Refresh Token" });
            return;
        }
        // Cấp lại Access Token mới
        const newAccessToken = (0, jwt_1.generateToken)({
            userId: user.id,
            roleId: user.roleId,
        });
        res.status(200).json({ accessToken: newAccessToken });
    }
    catch (error) {
        console.error("Refresh Token Error:", error);
        res.status(403).json({ message: "Invalid or Expired Refresh Token" });
    }
};
exports.refreshToken = refreshToken;
const logout = async (req, res) => {
    try {
        const rfToken = req.cookies.refreshToken;
        if (rfToken) {
            // Xóa refresh token trong DB
            try {
                const decoded = (0, jwt_1.verifyRefreshToken)(rfToken);
                await prisma_1.default.user.update({
                    where: { id: decoded.userId },
                    data: { refreshToken: null },
                });
            }
            catch (e) {
                // Token có thể đã hết hạn, cứ kệ và xóa cookie thôi
            }
        }
        // Xóa cookie
        res.clearCookie("refreshToken");
        res.status(200).json({ message: "Đăng xuất thành công" });
    }
    catch (error) {
        console.error("Logout Error:", error);
        res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
    }
};
exports.logout = logout;
//# sourceMappingURL=authController.js.map