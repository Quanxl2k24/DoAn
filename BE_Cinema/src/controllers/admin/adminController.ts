import { Request, Response } from "express";
import prisma from "../../config/prisma";

export const getAnalytics = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const days = Number(req.query.days) || 7;
    const since = new Date();
    since.setDate(since.getDate() - days);

    const [totalRevenue, totalTickets, totalMovies, totalUsers] =
      await Promise.all([
        prisma.thanhToan.aggregate({
          _sum: { tongTien: true },
          where: {
            trangThai: "THANH_CONG",
            thoiGian: { gte: since },
          },
        }),
        prisma.ve.count({
          where: {
            trangThai: "DA_DAT",
            thoiGianDat: { gte: since },
          },
        }),
        prisma.phim.count({
          where: { trangThai: "DANG_CHIEU" },
        }),
        prisma.user.count({
          where: { createdAt: { gte: since } },
        }),
      ]);

    const totalSeats = await prisma.ghe.count();
    const bookedSeats = await prisma.ve.count({
      where: { trangThai: "DA_DAT", thoiGianDat: { gte: since } },
    });
    const occupancyRate =
      totalSeats > 0
        ? Math.round((bookedSeats / (totalSeats * days)) * 100)
        : 0;

    res.status(200).json({
      data: {
        totalRevenue: totalRevenue._sum.tongTien || 0,
        totalTickets,
        totalMovies,
        totalUsers,
        occupancyRate,
      },
    });
  } catch (error) {
    console.error("Get Analytics Error:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

export const getRevenueChart = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const days = Number(req.query.days) || 7;
    const labels: string[] = [];
    const data: number[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const start = new Date(date.setHours(0, 0, 0, 0));
      const end = new Date(date.setHours(23, 59, 59, 999));

      const result = await prisma.thanhToan.aggregate({
        _sum: { tongTien: true },
        where: {
          trangThai: "THANH_CONG",
          thoiGian: { gte: start, lte: end },
        },
      });

      const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
      labels.push(dayNames[start.getDay()]!);
      data.push(result._sum.tongTien || 0);
    }

    res.status(200).json({ data: { labels, data } });
  } catch (error) {
    console.error("Get Revenue Chart Error:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

export const getWeeklyRevenue = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    const result: Array<{ day: string; revenue: number }> =
      await prisma.$queryRawUnsafe(
        `
        SELECT
          DATE_TRUNC('day', "thoiGian")::date AS "day",
          COALESCE(SUM("tongTien"), 0) AS revenue
        FROM "ThanhToan"
        WHERE "trangThai" = 'THANH_CONG'
          AND "thoiGian" >= $1::date
          AND "thoiGian" < ($1::date + INTERVAL '7 days')
        GROUP BY DATE_TRUNC('day', "thoiGian")
        ORDER BY "day" ASC
        `,
        monday.toISOString().split("T")[0],
      );

    const revenueByDay = new Map(
      result.map((r) => [
        new Date(r.day).toISOString().split("T")[0],
        Number(r.revenue),
      ]),
    );

    const data: Array<{
      day: string;
      label: any;
      date: string;
      revenue: number;
    }> = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const key = d.toISOString().split("T")[0] || "";
      const label = dayNames[(i + 1) % 7] || "";
      data.push({
        day: key,
        label,
        date:
          d.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
          }) || "",
        revenue: revenueByDay.get(key) || 0,
      });
    }

    res.status(200).json({ data });
  } catch (error) {
    console.error("Get Weekly Revenue Error:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

export const getTopMovies = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const days = Number(req.query.days) || 7;
    const since = new Date();
    since.setDate(since.getDate() - days);

    const topMovies = await prisma.ve.groupBy({
      by: ["suatChieuId"],
      where: {
        trangThai: "DA_DAT",
        thoiGianDat: { gte: since },
      },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 5,
    });

    const result = await Promise.all(
      topMovies.map(async (item) => {
        const suatChieu = await prisma.suatChieu.findUnique({
          where: { id: item.suatChieuId },
          include: { phim: true },
        });
        return {
          phimId: suatChieu?.phim.id,
          tenPhim: suatChieu?.phim.tenPhim || "N/A",
          posterUrl: suatChieu?.phim.posterUrl || "",
          totalTickets: item._count.id,
        };
      }),
    );

    res.status(200).json({ data: result });
  } catch (error) {
    console.error("Get Top Movies Error:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};
