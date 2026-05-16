import { Request, Response } from "express";
import prisma from "../../config/prisma";

export const getAllPhim = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const trangThai = req.query.trangThai as string | undefined;
    const page = req.query.page as string | undefined ?? '1';
    const limit = req.query.limit as string | undefined ?? '10';
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (trangThai) where.trangThai = trangThai;

    const [phims, total] = await Promise.all([
      prisma.phim.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { ngayKhoiChieu: "desc" },
      }),
      prisma.phim.count({ where }),
    ]);

    res.status(200).json({
      data: phims,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Get All Phim Error:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

export const getPhimById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const phim = await prisma.phim.findUnique({ where: { id } });

    if (!phim) {
      res.status(404).json({ message: "Không tìm thấy phim" });
      return;
    }

    res.status(200).json({ data: phim });
  } catch (error) {
    console.error("Get Phim By Id Error:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

export const createPhim = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data = req.body;
    const phim = await prisma.phim.create({ data });
    res.status(201).json({ message: "Tạo phim thành công", data: phim });
  } catch (error) {
    console.error("Create Phim Error:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

export const updatePhim = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const existing = await prisma.phim.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ message: "Không tìm thấy phim" });
      return;
    }

    const phim = await prisma.phim.update({
      where: { id },
      data: req.body,
    });
    res.status(200).json({ message: "Cập nhật phim thành công", data: phim });
  } catch (error) {
    console.error("Update Phim Error:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

export const deletePhim = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const existing = await prisma.phim.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ message: "Không tìm thấy phim" });
      return;
    }

    await prisma.phim.delete({ where: { id } });
    res.status(200).json({ message: "Xoá phim thành công" });
  } catch (error) {
    console.error("Delete Phim Error:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};