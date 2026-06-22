import { Request, Response } from "express";
import prisma from "../../config/prisma";

export const datVe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { suatChieuId, gheIds, phuongThuc } = req.body;

    // Validate showtime
    const suatChieu = await prisma.suatChieu.findUnique({
      where: { id: suatChieuId },
      include: { phim: true },
    });
    if (!suatChieu) {
      res.status(404).json({ message: "Không tìm thấy suất chiếu" });
      return;
    }

    // Validate seats belong to the room
    const ghes = await prisma.ghe.findMany({
      where: { id: { in: gheIds }, phongId: suatChieu.phongId },
      include: { loaiGhe: true },
    });
    if (ghes.length !== gheIds.length) {
      res.status(400).json({ message: "Một số ghế không thuộc phòng chiếu này" });
      return;
    }

    // Check seats not already booked
    const booked = await prisma.ve.findMany({
      where: {
        suatChieuId,
        gheId: { in: gheIds },
        trangThai: "DA_DAT",
      },
    });
    if (booked.length > 0) {
      res.status(400).json({ message: "Một số ghế đã được đặt" });
      return;
    }

    // Verify user still has active holds for these seats
    const activeHolds = await prisma.giuGhe.count({
      where: {
        suatChieuId,
        userId,
        gheId: { in: gheIds },
        trangThai: "DANG_GIU",
        thoiGianHetHan: { gte: new Date() },
      },
    });
    if (activeHolds !== gheIds.length) {
      res.status(400).json({
        message:
          "Phiên giữ ghế đã hết hạn. Vui lòng quay lại chọn ghế và giữ ghế trước khi thanh toán.",
      });
      return;
    }

    // Calculate total (with price multiplier)
    const heSoGia = suatChieu.heSoGia || 1.0;
    const tongTien = ghes.reduce(
      (sum, ghe) => sum + Math.round((suatChieu.giaSuatChieu || suatChieu.phim.giaCoBan) * heSoGia) + ghe.loaiGhe.phuPhi,
      0
    );

    // Create payment
    const thanhToan = await prisma.thanhToan.create({
      data: {
        userId,
        tongTien,
        phuongThuc,
        trangThai: "THANH_CONG",
      },
    });

    // Create tickets
    const giaCoBan = Math.round((suatChieu.giaSuatChieu || suatChieu.phim.giaCoBan) * heSoGia);
    const ves = await Promise.all(
      ghes.map((ghe) =>
        prisma.ve.create({
          data: {
            userId,
            suatChieuId,
            gheId: ghe.id,
            thanhToanId: thanhToan.id,
            giaTien: giaCoBan + ghe.loaiGhe.phuPhi,
            trangThai: "DA_DAT",
          },
        })
      )
    );

    // Mark seat holds as purchased
    await prisma.giuGhe.updateMany({
      where: {
        suatChieuId,
        userId,
        gheId: { in: gheIds },
        trangThai: "DANG_GIU",
      },
      data: { trangThai: "DA_MUA" },
    });

    const chiTiet = ghes.map((ghe) => ({
      ...ghe,
      loaiGhe: ghe.loaiGhe,
      giaCoBan,
      phuPhi: ghe.loaiGhe.phuPhi,
      thanhTien: giaCoBan + ghe.loaiGhe.phuPhi,
    }));

    res.status(201).json({
      message: "Đặt vé thành công",
      data: {
        thanhToan,
        ves,
        chiTiet,
      },
    });
  } catch (error) {
    console.error("Dat Ve Error:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

export const adminLichSuGiaoDich = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      search,
      trangThai,
      fromDate,
      toDate,
      page = "1",
      limit = "15",
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit as string)));

    const where: any = {};

    if (trangThai) {
      where.trangThai = trangThai;
    }

    if (fromDate || toDate) {
      where.thoiGian = {};
      if (fromDate) {
        const fParts = (fromDate as string).split("-");
        where.thoiGian.gte = new Date(Number(fParts[0]), Number(fParts[1]) - 1, Number(fParts[2]));
      }
      if (toDate) {
        const tParts = (toDate as string).split("-");
        where.thoiGian.lte = new Date(Number(tParts[0]), Number(tParts[1]) - 1, Number(tParts[2]), 23, 59, 59, 999);
      }
    }

    if (search) {
      where.OR = [
        { id: { contains: search, mode: "insensitive" } },
        { user: { email: { contains: search, mode: "insensitive" } } },
        { user: { fullName: { contains: search, mode: "insensitive" } } },
        {
          ves: {
            some: {
              suatChieu: {
                phim: { tenPhim: { contains: search, mode: "insensitive" } },
              },
            },
          },
        },
      ];
    }

    const [total, giaoDichs] = await Promise.all([
      prisma.thanhToan.count({ where }),
      prisma.thanhToan.findMany({
        where,
        include: {
          user: { select: { id: true, email: true, fullName: true } },
          ves: {
            include: {
              suatChieu: {
                include: {
                  phim: true,
                  phong: { include: { rap: true } },
                },
              },
              ghe: { include: { loaiGhe: true } },
            },
          },
        },
        orderBy: { thoiGian: "desc" },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
    ]);

    res.status(200).json({
      data: giaoDichs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Admin Lich Su Giao Dich Error:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

export const lichSuGiaoDich = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const giaoDichs = await prisma.thanhToan.findMany({
      where: { userId },
      include: {
        ves: {
          include: {
            suatChieu: {
              include: {
                phim: true,
                phong: { include: { rap: true } },
              },
            },
            ghe: { include: { loaiGhe: true } },
          },
        },
      },
      orderBy: { thoiGian: "desc" },
    });

    res.status(200).json({ data: giaoDichs });
  } catch (error) {
    console.error("Lich Su Giao Dich Error:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};