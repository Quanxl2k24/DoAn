import app from "./app";
import prisma from "./config/prisma";

const PORT = process.env.PORT || 3000;

const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // 5 phút

async function cleanupExpiredHolds() {
  try {
    const result = await prisma.giuGhe.updateMany({
      where: {
        trangThai: "DANG_GIU",
        thoiGianHetHan: { lt: new Date() },
      },
      data: { trangThai: "HET_HAN" },
    });
    if (result.count > 0) {
      console.log(`Cleaned up ${result.count} expired seat holds`);
    }
  } catch (err) {
    console.error("Cleanup expired holds error:", err);
  }
}

async function initDefaultSeatTypes() {
  try {
    const defaultTypes = [
      { tenLoai: "THUONG", phuPhi: 0 },
      { tenLoai: "VIP", phuPhi: 50000 },
      { tenLoai: "SWEETBOX", phuPhi: 100000 }
    ];
    for (const type of defaultTypes) {
      const existing = await prisma.loaiGhe.findFirst({
        where: { tenLoai: type.tenLoai }
      });
      if (!existing) {
        await prisma.loaiGhe.create({
          data: type
        });
      }
    }
    console.log("Default seat types ensured");
  } catch (err) {
    console.error("Failed to initialize default seat types:", err);
  }
}

app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log("Connected PostgreSQL via Prisma");
    await initDefaultSeatTypes();
  } catch (err) {
    console.error("Failed to connect to database:", err);
  }

  console.log(`Server running on port ${PORT}`);

  // Start cleanup job
  cleanupExpiredHolds();
  setInterval(cleanupExpiredHolds, CLEANUP_INTERVAL_MS);
  console.log(`Cleanup job started (every ${CLEANUP_INTERVAL_MS / 1000}s)`);
});

