import { Request, Response } from "express";
import prisma from "../config/prisma";

export const getAllNgayLe = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const ngayLes = await prisma.ngayLe.findMany({
      orderBy: { ngay: "asc" },
    });
    res.status(200).json({ data: ngayLes });
  } catch (error) {
    console.error("Get All NgayLe Error:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};
