import { Request, Response } from "express";
import prisma from "../../config/prisma";

export const getPhongsByRap = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const rapId = req.params.rapId as string;
    const phongs = await prisma.phongChieu.findMany({
      where: { rapId },
      include: { ghes: true },
    });
    res.status(200).json({ data: phongs });
  } catch (error) {
    console.error("Get Phongs By Rap Error:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};
export const getPhongById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const phong = await prisma.phongChieu.findUnique({
      where: { id },
      include: { rap: true },
    });
    if (!phong) {
      res.status(404).json({ message: "Không tìm thấy phòng" });
      return;
    }
    res.status(200).json({ data: phong });
  } catch (error) {
    console.error("Get Phong By Id Error:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};
export const createPhong = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { rapId, tenPhong, soHang, soCot } = req.body;
    
    // 1. Tạo phòng chiếu
    const phong = await prisma.phongChieu.create({
      data: { rapId, tenPhong },
    });

    // 2. Tự động tạo ghế nếu có soHang và soCot
    if (soHang && soCot) {
      let loaiGheThuong = await prisma.loaiGhe.findFirst({
        where: { tenLoai: "THUONG" }
      });

      // Tự tạo loại ghế mặc định nếu chưa có
      if (!loaiGheThuong) {
        loaiGheThuong = await prisma.loaiGhe.create({
          data: { tenLoai: "THUONG", phuPhi: 0 }
        });
      }

      const seatsData = [];
      for (let i = 0; i < soHang; i++) {
        const rowChar = String.fromCharCode(65 + i);
        for (let j = 1; j <= soCot; j++) {
          seatsData.push({
            phongId: phong.id,
            loaiGheId: loaiGheThuong.id,
            hang: rowChar,
            cot: j,
            tenGhe: `${rowChar}${j}`,
            trangThai: "HOAT_DONG"
          });
        }
      }

      await prisma.ghe.createMany({ data: seatsData });
    }

    res.status(201).json({ message: "Tạo phòng và sơ đồ ghế thành công", data: phong });
  } catch (error) {
    console.error("Create Phong Error:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

export const updatePhong = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const existing = await prisma.phongChieu.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ message: "Không tìm thấy phòng" });
      return;
    }
    const phong = await prisma.phongChieu.update({
      where: { id },
      data: req.body,
    });
    res.status(200).json({ message: "Cập nhật phòng thành công", data: phong });
  } catch (error) {
    console.error("Update Phong Error:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

export const deletePhong = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const existing = await prisma.phongChieu.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ message: "Không tìm thấy phòng" });
      return;
    }
    await prisma.phongChieu.delete({ where: { id } });
    res.status(200).json({ message: "Xoá phòng thành công" });
  } catch (error) {
    console.error("Delete Phong Error:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};