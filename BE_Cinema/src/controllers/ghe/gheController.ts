import { Request, Response } from "express";
import prisma from "../../config/prisma";

export const getTrangThaiGhe = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const suatChieuId = req.params.suatChieuId as string;

    const suatChieu = await prisma.suatChieu.findUnique({
      where: { id: suatChieuId },
      include: {
        phim: true,
        phong: {
          include: {
            ghes: {
              include: { loaiGhe: true },
              orderBy: [{ hang: "asc" }, { cot: "asc" }],
            },
          },
        },
      },
    });

    if (!suatChieu) {
      res.status(404).json({ message: "Không tìm thấy suất chiếu" });
      return;
    }

    // Get locked seats
    const lockedSeats = await prisma.giuGhe.findMany({
      where: {
        suatChieuId,
        trangThai: "DANG_GIU",
        thoiGianHetHan: { gte: new Date() },
      },
      select: { gheId: true },
    });

    // Get booked seats
    const bookedSeats = await prisma.ve.findMany({
      where: {
        suatChieuId,
        trangThai: "DA_DAT",
      },
      select: { gheId: true },
    });

    const lockedGheIds = new Set(lockedSeats.map((s) => s.gheId));
    const bookedGheIds = new Set(bookedSeats.map((s) => s.gheId));

    const ghes = suatChieu.phong.ghes.map((ghe) => ({
      id: ghe.id,
      tenGhe: ghe.tenGhe,
      hang: ghe.hang,
      cot: ghe.cot,
      loaiGhe: ghe.loaiGhe.tenLoai,
      phuPhi: ghe.loaiGhe.phuPhi,
      trangThaiGhe: ghe.trangThai,
      trangThai: bookedGheIds.has(ghe.id)
        ? "DA_BAN"
        : lockedGheIds.has(ghe.id)
          ? "DANG_GIU"
          : "TRONG",
    }));

    res.status(200).json({
      data: {
        suatChieu: {
          id: suatChieu.id,
          thoiGianBatDau: suatChieu.thoiGianBatDau,
          thoiGianKetThuc: suatChieu.thoiGianKetThuc,
          giaSuatChieu: suatChieu.giaSuatChieu || suatChieu.phim.giaCoBan,
          heSoGia: suatChieu.heSoGia || 1.0,
        },
        phim: {
          id: suatChieu.phim.id,
          tenPhim: suatChieu.phim.tenPhim,
          giaCoBan: suatChieu.phim.giaCoBan,
        },
        phong: {
          id: suatChieu.phong.id,
          tenPhong: suatChieu.phong.tenPhong,
        },
        ghes,
      },
    });
  } catch (error) {
    console.error("Get TrangThai Ghe Error:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

export const giuGhe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { suatChieuId, gheIds } = req.body;

    // Check showtime exists
    const suatChieu = await prisma.suatChieu.findUnique({
      where: { id: suatChieuId },
    });
    if (!suatChieu) {
      res.status(404).json({ message: "Không tìm thấy suất chiếu" });
      return;
    }

    // Check if any seats are already booked or locked
    const booked = await prisma.ve.findMany({
      where: {
        suatChieuId,
        gheId: { in: gheIds },
        trangThai: "DA_DAT",
      },
    });
    if (booked.length > 0) {
      res.status(400).json({
        message: `Ghế ${booked.map((v) => v.gheId).join(", ")} đã được đặt`,
      });
      return;
    }

    const existingLocks = await prisma.giuGhe.findMany({
      where: {
        suatChieuId,
        gheId: { in: gheIds },
        trangThai: "DANG_GIU",
        thoiGianHetHan: { gte: new Date() },
        userId: { not: userId },
      },
    });
    if (existingLocks.length > 0) {
      res.status(400).json({
        message: "Một số ghế đang được giữ bởi người khác",
      });
      return;
    }

    // Release old locks for this user + showtime
    await prisma.giuGhe.updateMany({
      where: { suatChieuId, userId, trangThai: "DANG_GIU" },
      data: { trangThai: "HET_HAN" },
    });

    // Create new locks
    const thoiGianHetHan = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    const giuGhes = await Promise.all(
      gheIds.map((gheId: string) =>
        prisma.giuGhe.create({
          data: {
            gheId,
            suatChieuId,
            userId,
            thoiGianHetHan,
          },
        })
      )
    );

    res.status(200).json({
      message: "Giữ ghế thành công",
      data: giuGhes,
      hetHanLuc: thoiGianHetHan,
    });
  } catch (error) {
    console.error("Giu Ghe Error:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

export const huyGiuGhe = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { suatChieuId } = req.body;

    await prisma.giuGhe.updateMany({
      where: { suatChieuId, userId, trangThai: "DANG_GIU" },
      data: { trangThai: "HET_HAN" },
    });

    res.status(200).json({ message: "Hủy giữ ghế thành công" });
  } catch (error) {
    console.error("Huy Giu Ghe Error:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

export const getHeldSeats = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const suatChieuId = req.params.suatChieuId as string;

    const held = await prisma.giuGhe.findMany({
      where: {
        suatChieuId,
        userId,
        trangThai: "DANG_GIU",
        thoiGianHetHan: { gte: new Date() },
      },
      select: { gheId: true, thoiGianHetHan: true },
    });

    if (held.length === 0) {
      res.status(200).json({ data: null, message: "Không có ghế nào đang giữ" });
      return;
    }

    res.status(200).json({
      data: {
        gheIds: held.map((h) => h.gheId),
        hetHanLuc: held[0]!.thoiGianHetHan,
      },
    });
  } catch (error) {
    console.error("Get Held Seats Error:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

export const getGhesByPhong = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const phongId = req.params.phongId as string;
    const ghes = await prisma.ghe.findMany({
      where: { phongId },
      include: { loaiGhe: true },
      orderBy: [{ hang: "asc" }, { cot: "asc" }],
    });

    const loaiGhes = await prisma.loaiGhe.findMany();

    res.status(200).json({ data: { ghes, loaiGhes } });
  } catch (error) {
    console.error("Get Ghes By Phong Error:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

export const updateGhes = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { gheIds, loaiGheId, trangThai } = req.body;

    const data: any = {};
    if (loaiGheId) data.loaiGheId = loaiGheId;
    if (trangThai) data.trangThai = trangThai;

    await prisma.ghe.updateMany({
      where: { id: { in: gheIds } },
      data,
    });

    res.status(200).json({ message: "Cập nhật danh sách ghế thành công" });
  } catch (error) {
    console.error("Update Ghes Error:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};