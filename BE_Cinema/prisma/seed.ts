import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Bắt đầu seed data...");

  // === 1. Roles & Permissions ===
  const adminRole = await prisma.role.upsert({
    where: { name: "ADMIN" },
    update: {},
    create: { name: "ADMIN" },
  });
  const userRole = await prisma.role.upsert({
    where: { name: "USER" },
    update: {},
    create: { name: "USER" },
  });
  await prisma.role.upsert({
    where: { name: "STAFF" },
    update: {},
    create: { name: "STAFF" },
  });
  console.log("✅ Roles created");

  // Permissions
  const permissions = [
    "CREATE_MOVIE", "UPDATE_MOVIE", "DELETE_MOVIE",
    "CREATE_SHOWTIME", "UPDATE_SHOWTIME", "DELETE_SHOWTIME",
    "MANAGE_USERS", "VIEW_REVENUE",
  ];
  for (const action of permissions) {
    await prisma.permission.upsert({
      where: { action },
      update: {},
      create: { action },
    });
  }
  console.log("✅ Permissions created");

  // === 2. Admin User ===
  const adminPassword = await bcrypt.hash("Admin@123", 10);
  await prisma.user.upsert({
    where: { email: "admin@cinepremiere.com" },
    update: {},
    create: {
      email: "admin@cinepremiere.com",
      password: adminPassword,
      fullName: "Admin Cine Première",
      phoneNumber: "0900000000",
      roleId: adminRole.id,
    },
  });
  console.log("✅ Admin user created (admin@cinepremiere.com / Admin@123)");

  // === 3. Seat Types ===
  const loaiThuong = await prisma.loaiGhe.upsert({
    where: { id: "loai-thuong" },
    update: {},
    create: { id: "loai-thuong", tenLoai: "THUONG", phuPhi: 0 },
  });
  const loaiVip = await prisma.loaiGhe.upsert({
    where: { id: "loai-vip" },
    update: {},
    create: { id: "loai-vip", tenLoai: "VIP", phuPhi: 50000 },
  });
  const loaiSweetbox = await prisma.loaiGhe.upsert({
    where: { id: "loai-sweetbox" },
    update: {},
    create: { id: "loai-sweetbox", tenLoai: "SWEETBOX", phuPhi: 100000 },
  });
  console.log("✅ Seat types created");

  // === 4. Cinemas & Rooms ===
  const rap1 = await prisma.rapChieu.upsert({
    where: { id: "rap-01" },
    update: {},
    create: {
      id: "rap-01",
      tenRap: "Cine Première Vincom Đồng Khởi",
      diaChi: "Tầng 5, Vincom Đồng Khởi, Quận 1, TP.HCM",
    },
  });
  const rap2 = await prisma.rapChieu.upsert({
    where: { id: "rap-02" },
    update: {},
    create: {
      id: "rap-02",
      tenRap: "Cine Première Lê Văn Việt",
      diaChi: "Tầng 3, Vincom Lê Văn Việt, Quận 9, TP.HCM",
    },
  });
  console.log("✅ Cinemas created");

  // Rooms for rap1
  for (let i = 1; i <= 4; i++) {
    await prisma.phongChieu.upsert({
      where: { id: `phong-rap1-${i}` },
      update: {},
      create: {
        id: `phong-rap1-${i}`,
        rapId: rap1.id,
        tenPhong: `Rạp ${i}`,
      },
    });
  }
  // Rooms for rap2
  for (let i = 1; i <= 2; i++) {
    await prisma.phongChieu.upsert({
      where: { id: `phong-rap2-${i}` },
      update: {},
      create: {
        id: `phong-rap2-${i}`,
        rapId: rap2.id,
        tenPhong: `Rạp ${i}`,
      },
    });
  }
  console.log("✅ Rooms created");

  // === 5. Seats for each room ===
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const seatsPerRow = 12;
  const allPhongs = await prisma.phongChieu.findMany();

  for (const phong of allPhongs) {
    for (const hang of rows) {
      for (let cot = 1; cot <= seatsPerRow; cot++) {
        const isVip = (hang === "D" || hang === "E" || hang === "F") && cot >= 3 && cot <= 10;
        const isSweetbox = hang === "G" && cot >= 5 && cot <= 8;
        const loaiGheId = isSweetbox ? loaiSweetbox.id : isVip ? loaiVip.id : loaiThuong.id;

        await prisma.ghe.upsert({
          where: {
            id: `ghe-${phong.id}-${hang}${cot}`,
          },
          update: {},
          create: {
            id: `ghe-${phong.id}-${hang}${cot}`,
            phongId: phong.id,
            loaiGheId,
            hang,
            cot,
            tenGhe: `${hang}${cot}`,
          },
        });
      }
    }
  }
  console.log("✅ Seats created (96 seats per room)");

  // === 6. Movies ===
  const movies = [
    {
      id: "phim-dune",
      tenPhim: "DUNE: HÀNH TINH CÁT",
      moTa: `Paul Atreides, một chàng trai trẻ tài năng và xuất chúng, sinh ra để thực hiện một sứ mệnh vượt quá tầm hiểu biết của mình. Cậu phải du hành đến hành tinh nguy hiểm nhất vũ trụ để bảo vệ tương lai của gia đình và người dân.`,
      posterUrl: "/posterphim/dune.jpg",
      backdropUrl: "/posterphim/hanhtinhcat2.jpg",
      thoiLuong: 155,
      ngayKhoiChieu: new Date("2026-05-10"),
      theLoai: "Hành động, Viễn tưởng",
      ngonNgu: "Phụ đề Tiếng Việt",
      daoDien: "Denis Villeneuve",
      dienVien: "Timothée Chalamet, Zendaya, Rebecca Ferguson, Oscar Isaac",
      phanLoaiTuoi: "T18",
      giaCoBan: 120000,
      trangThai: "DANG_CHIEU",
    },
    {
      id: "phim-bongde",
      tenPhim: "BÓNG ĐÈ",
      moTa: `Một bộ phim kinh dị tâm lý xoay quanh những bí ẩn đen tối ẩn giấu trong căn nhà cổ.`,
      posterUrl: "/posterphim/bongde.jpg",
      thoiLuong: 110,
      ngayKhoiChieu: new Date("2026-05-05"),
      theLoai: "Kinh dị, Tâm lý",
      ngonNgu: "Phụ đề Tiếng Việt",
      daoDien: "Võ Thanh Hòa",
      phanLoaiTuoi: "T18",
      giaCoBan: 110000,
      trangThai: "DANG_CHIEU",
    },
    {
      id: "phim-latmat7",
      tenPhim: "LẬT MẶT 7",
      moTa: `Phần tiếp theo của series Lật Mặt đình đám với nhiều pha hành động nghẹt thở.`,
      posterUrl: "/posterphim/latmat7.jpg",
      thoiLuong: 120,
      ngayKhoiChieu: new Date("2026-04-20"),
      theLoai: "Hành động, Gia đình",
      ngonNgu: "Tiếng Việt",
      daoDien: "Lý Hải",
      phanLoaiTuoi: "C13",
      giaCoBan: 100000,
      trangThai: "DANG_CHIEU",
    },
    {
      id: "phim-hanhtinhcat2",
      tenPhim: "HÀNH TINH CÁT 2",
      moTa: `Phần tiếp theo của câu chuyện về hành tinh sa mạc Arrakis.`,
      posterUrl: "/posterphim/dune.jpg",
      backdropUrl: "/posterphim/hanhtinhcat2.jpg",
      thoiLuong: 165,
      ngayKhoiChieu: new Date("2026-07-01"),
      theLoai: "Hành động, Viễn tưởng",
      ngonNgu: "Phụ đề Tiếng Việt",
      daoDien: "Denis Villeneuve",
      phanLoaiTuoi: "T18",
      giaCoBan: 130000,
      trangThai: "SAP_CHIEU",
    },
    {
      id: "phim-thanhxuan",
      tenPhim: "THANH XUÂN CÓ BẠN",
      moTa: `Câu chuyện tình yêu tuổi học trò ngọt ngào và đầy cảm xúc.`,
      posterUrl: "/posterphim/thanhxuancoban.jpg",
      thoiLuong: 95,
      ngayKhoiChieu: new Date("2026-06-15"),
      theLoai: "Lãng mạn, Học đường",
      ngonNgu: "Phụ đề Tiếng Việt",
      daoDien: "Nguyễn Quang Dũng",
      phanLoaiTuoi: "P",
      giaCoBan: 90000,
      trangThai: "SAP_CHIEU",
    },
  ];

  for (const movie of movies) {
    await prisma.phim.upsert({
      where: { id: movie.id },
      update: movie,
      create: movie,
    });
  }
  console.log("✅ Movies created");

  // === 7. Showtimes ===
  const HCM_PHONG_IDS = ["phong-rap1-1", "phong-rap1-2", "phong-rap1-3"];
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const showtimesData = [
    { phimId: "phim-dune", phongId: HCM_PHONG_IDS[0]!, hour: 9, minute: 30 },
    { phimId: "phim-dune", phongId: HCM_PHONG_IDS[1]!, hour: 12, minute: 0 },
    { phimId: "phim-dune", phongId: HCM_PHONG_IDS[2]!, hour: 14, minute: 45 },
    { phimId: "phim-dune", phongId: HCM_PHONG_IDS[0]!, hour: 18, minute: 15 },
    { phimId: "phim-dune", phongId: HCM_PHONG_IDS[1]!, hour: 20, minute: 30 },
    { phimId: "phim-dune", phongId: HCM_PHONG_IDS[2]!, hour: 22, minute: 45 },
    { phimId: "phim-bongde", phongId: HCM_PHONG_IDS[0]!, hour: 21, minute: 0 },
    { phimId: "phim-bongde", phongId: HCM_PHONG_IDS[1]!, hour: 23, minute: 15 },
    { phimId: "phim-latmat7", phongId: HCM_PHONG_IDS[2]!, hour: 10, minute: 0 },
    { phimId: "phim-latmat7", phongId: HCM_PHONG_IDS[0]!, hour: 13, minute: 15 },
    { phimId: "phim-latmat7", phongId: HCM_PHONG_IDS[1]!, hour: 16, minute: 0 },
    { phimId: "phim-latmat7", phongId: HCM_PHONG_IDS[2]!, hour: 19, minute: 45 },
  ];

  for (let day = 0; day < 7; day++) {
    for (const st of showtimesData) {
      const phim = movies.find((m) => m.id === st.phimId)!;
      const batDau = new Date(startOfDay);
      batDau.setDate(batDau.getDate() + day);
      batDau.setHours(st.hour, st.minute, 0, 0);

      const ketThuc = new Date(batDau.getTime() + phim.thoiLuong * 60000);

      await prisma.suatChieu.create({
        data: {
          phimId: st.phimId,
          phongId: st.phongId,
          thoiGianBatDau: batDau,
          thoiGianKetThuc: ketThuc,
        },
      });
    }
  }
  console.log("✅ Showtimes created for 7 days");

  console.log("🎉 Seed data hoàn tất!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });