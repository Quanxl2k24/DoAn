import { Request, Response } from "express";
import prisma from "../../config/prisma";

export const getAllRaps = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const raps = await prisma.rapChieu.findMany({
      include: { phongChieus: true },
    });
    res.status(200).json({ data: raps });
  } catch (error) {
    console.error("Get All Raps Error:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

export const getRapById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const rap = await prisma.rapChieu.findUnique({
      where: { id },
      include: { phongChieus: true },
    });
    if (!rap) {
      res.status(404).json({ message: "Không tìm thấy rạp" });
      return;
    }
    res.status(200).json({ data: rap });
  } catch (error) {
    console.error("Get Rap By Id Error:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

export const createRap = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const existingRap = await prisma.rapChieu.findFirst();
    if (existingRap) {
      res.status(400).json({ message: "Chỉ được tạo một rạp duy nhất" });
      return;
    }

    const { tenRap, diaChi } = req.body;
    const rap = await prisma.rapChieu.create({
      data: { tenRap, diaChi },
    });
    res.status(201).json({ message: "Tạo rạp thành công", data: rap });
  } catch (error) {
    console.error("Create Rap Error:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

export const updateRap = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const existing = await prisma.rapChieu.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ message: "Không tìm thấy rạp" });
      return;
    }
    const rap = await prisma.rapChieu.update({
      where: { id },
      data: req.body,
    });
    res.status(200).json({ message: "Cập nhật rạp thành công", data: rap });
  } catch (error) {
    console.error("Update Rap Error:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

export const deleteRap = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const existing = await prisma.rapChieu.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ message: "Không tìm thấy rạp" });
      return;
    }
    res.status(400).json({ message: "Không thể xoá rạp. Hệ thống chỉ cho phép một rạp duy nhất." });
  } catch (error) {
    console.error("Delete Rap Error:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};