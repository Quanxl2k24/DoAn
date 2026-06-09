import { Request, Response } from "express";
import prisma from "../../config/prisma";

export const getAllLoaiGhe = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const loaiGhes = await prisma.loaiGhe.findMany({
      orderBy: { phuPhi: "asc" },
    });
    res.status(200).json({ data: loaiGhes });
  } catch (error) {
    console.error("Get All LoaiGhe Error:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

export const getLoaiGheById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const loaiGhe = await prisma.loaiGhe.findUnique({ where: { id } });
    if (!loaiGhe) {
      res.status(404).json({ message: "Không tìm thấy loại ghế" });
      return;
    }
    res.status(200).json({ data: loaiGhe });
  } catch (error) {
    console.error("Get LoaiGhe By Id Error:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

export const createLoaiGhe = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { tenLoai, phuPhi } = req.body;

    const existing = await prisma.loaiGhe.findFirst({
      where: { tenLoai: tenLoai?.toUpperCase() },
    });
    if (existing) {
      res.status(400).json({ message: "Loại ghế này đã tồn tại" });
      return;
    }

    const loaiGhe = await prisma.loaiGhe.create({
      data: {
        tenLoai: tenLoai?.toUpperCase(),
        phuPhi: phuPhi || 0,
      },
    });

    res
      .status(201)
      .json({ message: "Tạo loại ghế thành công", data: loaiGhe });
  } catch (error) {
    console.error("Create LoaiGhe Error:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

export const updateLoaiGhe = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { tenLoai, phuPhi } = req.body;

    const existing = await prisma.loaiGhe.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ message: "Không tìm thấy loại ghế" });
      return;
    }

    if (tenLoai) {
      const dup = await prisma.loaiGhe.findFirst({
        where: { tenLoai: tenLoai.toUpperCase(), id: { not: id } },
      });
      if (dup) {
        res.status(400).json({ message: "Tên loại ghế đã tồn tại" });
        return;
      }
    }

    const loaiGhe = await prisma.loaiGhe.update({
      where: { id },
      data: {
        ...(tenLoai && { tenLoai: tenLoai.toUpperCase() }),
        ...(phuPhi !== undefined && { phuPhi }),
      },
    });

    res
      .status(200)
      .json({ message: "Cập nhật loại ghế thành công", data: loaiGhe });
  } catch (error) {
    console.error("Update LoaiGhe Error:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

export const deleteLoaiGhe = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id as string;

    const existing = await prisma.loaiGhe.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ message: "Không tìm thấy loại ghế" });
      return;
    }

    const seatsUsing = await prisma.ghe.count({ where: { loaiGheId: id } });
    if (seatsUsing > 0) {
      res.status(400).json({
        message: `Không thể xoá. Còn ${seatsUsing} ghế đang sử dụng loại ghế này.`,
      });
      return;
    }

    await prisma.loaiGhe.delete({ where: { id } });
    res.status(200).json({ message: "Xoá loại ghế thành công" });
  } catch (error) {
    console.error("Delete LoaiGhe Error:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};
