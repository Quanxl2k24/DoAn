import { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma";

export const requireRole = (...roles: string[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { role: true },
      });

      if (!user || !roles.includes(user.role.name)) {
        res.status(403).json({ message: "Bạn không có quyền thực hiện hành động này" });
        return;
      }

      next();
    } catch (error) {
      console.error("Role Middleware Error:", error);
      res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
    }
  };
};