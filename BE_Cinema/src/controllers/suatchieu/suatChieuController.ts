import { Request, Response } from "express";
import prisma from "../../config/prisma";

export const getSuatChieu = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const phimId = req.query.phimId as string | undefined;
    const rapId = req.query.rapId as string | undefined;
    const ngay = req.query.ngay as string | undefined;
    const where: any = {};

    if (phimId) where.phimId = phimId;
    if (rapId) {
      where.phong = { rapId };
    }
    if (ngay) {
      const date = new Date(ngay);
      const start = new Date(date.setHours(0, 0, 0, 0));
      const end = new Date(date.setHours(23, 59, 59, 999));
      where.thoiGianBatDau = { gte: start, lte: end };
    }

    const suatChieus = await prisma.suatChieu.findMany({
      where,
      include: {
        phim: true,
        phong: {
          include: { rap: true },
        },
        _count: { select: { ves: true } },
      },
      orderBy: { thoiGianBatDau: "asc" },
    });

    // Calculate available seats
    const result = await Promise.all(
      suatChieus.map(async (sc) => {
        const totalSeats = await prisma.ghe.count({
          where: { phongId: sc.phongId },
        });
        return {
          ...sc,
          soGheTrong: totalSeats - sc._count.ves,
          soGheDat: sc._count.ves,
        };
      })
    );

    res.status(200).json({ data: result });
  } catch (error) {
    console.error("Get SuatChieu Error:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

export const createSuatChieu = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { phimId, phongId, thoiGianBatDau, giaSuatChieu } = req.body;
    const phim = await prisma.phim.findUnique({ where: { id: phimId } });
    if (!phim) {
      res.status(404).json({ message: "Không tìm thấy phim" });
      return;
    }

    const start = new Date(thoiGianBatDau);
    const end = new Date(start.getTime() + phim.thoiLuong * 60000);
    const endWithBuffer = new Date(end.getTime() + 15 * 60000); // 15 phút dọn phòng

    // Kiểm tra trùng lịch (Overlap check)
    const overlap = await prisma.suatChieu.findFirst({
      where: {
        phongId,
        OR: [
          {
            thoiGianBatDau: { lt: endWithBuffer },
            thoiGianKetThuc: { gt: start },
          },
        ],
      },
      include: { phim: true }
    });

    if (overlap) {
      res.status(400).json({ 
        message: `Trùng lịch với phim "${overlap.phim.tenPhim}" (${new Date(overlap.thoiGianBatDau).toLocaleTimeString()} - ${new Date(overlap.thoiGianKetThuc).toLocaleTimeString()}). Vui lòng chọn khung giờ khác.` 
      });
      return;
    }

    const suatChieu = await prisma.suatChieu.create({
      data: { 
        phimId, 
        phongId, 
        thoiGianBatDau: start, 
        thoiGianKetThuc: end,
        giaSuatChieu: giaSuatChieu ? parseFloat(giaSuatChieu) : phim.giaCoBan 
      },
    });

    res.status(201).json({ message: "Tạo suất chiếu thành công", data: suatChieu });
  } catch (error) {
    console.error("Create SuatChieu Error:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

export const deleteSuatChieu = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const existing = await prisma.suatChieu.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ message: "Không tìm thấy suất chiếu" });
      return;
    }
    await prisma.suatChieu.delete({ where: { id } });
    res.status(200).json({ message: "Xoá suất chiếu thành công" });
  } catch (error) {
    console.error("Delete SuatChieu Error:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};