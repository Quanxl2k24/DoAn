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

export const createNgayLe = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { tenNgayLe, ngay } = req.body;
    if (!tenNgayLe || !ngay) {
      res.status(400).json({ message: "Tên ngày lễ và ngày là bắt buộc" });
      return;
    }
    const ngayLe = await prisma.ngayLe.create({
      data: { tenNgayLe, ngay: new Date(ngay) },
    });
    res.status(201).json({ message: "Thêm ngày lễ thành công", data: ngayLe });
  } catch (error) {
    console.error("Create NgayLe Error:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

export const deleteNgayLe = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const existing = await prisma.ngayLe.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ message: "Không tìm thấy ngày lễ" });
      return;
    }
    await prisma.ngayLe.delete({ where: { id } });
    res.status(200).json({ message: "Xoá ngày lễ thành công" });
  } catch (error) {
    console.error("Delete NgayLe Error:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};
