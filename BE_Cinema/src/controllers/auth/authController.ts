import { Request, Response } from "express";
import bcrypt from "bcrypt";
import prisma from "../../config/prisma";
import { generateToken, generateRefreshToken, verifyRefreshToken } from "../../utils/jwt";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, fullName, phoneNumber } = req.body;

    // Kiểm tra xem email đã tồn tại chưa
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: "Email đã được sử dụng" });
      return;
    }

    // Tìm hoặc tạo Role mặc định là "USER"
    let role = await prisma.role.findUnique({ where: { name: "USER" } });
    if (!role) {
      role = await prisma.role.create({ data: { name: "USER" } });
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Lưu user vào DB
    const newUser = await prisma.user.create({
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
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Tìm user theo email kèm theo thông tin role
    const user = await prisma.user.findUnique({ 
      where: { email },
      include: { role: true }
    });
    if (!user) {
      res.status(401).json({ message: "Email hoặc mật khẩu không chính xác" });
      return;
    }

    // So sánh mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Email hoặc mật khẩu không chính xác" });
      return;
    }

    // Tạo JWT
    const token = generateToken({
      userId: user.id,
      roleId: user.roleId,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      roleId: user.roleId,
    });

    // Lưu refresh token vào DB
    await prisma.user.update({
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
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Không tìm thấy thông tin xác thực" });
      return;
    }

    const user = await prisma.user.findUnique({
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
  } catch (error) {
    console.error("Get Me Error:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const rfToken = req.cookies.refreshToken;
    if (!rfToken) {
      res.status(401).json({ message: "Refresh Token Required" });
      return;
    }

    // Verify token
    const decoded = verifyRefreshToken(rfToken);

    // Kiểm tra DB xem token có khớp không (để phòng trường hợp bị thu hồi)
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user || user.refreshToken !== rfToken) {
      res.status(403).json({ message: "Invalid Refresh Token" });
      return;
    }

    // Cấp lại Access Token mới
    const newAccessToken = generateToken({
      userId: user.id,
      roleId: user.roleId,
    });

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Refresh Token Error:", error);
    res.status(403).json({ message: "Invalid or Expired Refresh Token" });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const rfToken = req.cookies.refreshToken;
    if (rfToken) {
      // Xóa refresh token trong DB
      try {
        const decoded = verifyRefreshToken(rfToken);
        await prisma.user.update({
          where: { id: decoded.userId },
          data: { refreshToken: null },
        });
      } catch (e) {
        // Token có thể đã hết hạn, cứ kệ và xóa cookie thôi
      }
    }

    // Xóa cookie
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Đăng xuất thành công" });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};
