-- CreateTable
CREATE TABLE "RapChieu" (
    "id" TEXT NOT NULL,
    "tenRap" TEXT NOT NULL,
    "diaChi" TEXT NOT NULL,
    "trangThai" TEXT NOT NULL DEFAULT 'HOAT_DONG',

    CONSTRAINT "RapChieu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhongChieu" (
    "id" TEXT NOT NULL,
    "rapId" TEXT NOT NULL,
    "tenPhong" TEXT NOT NULL,
    "trangThai" TEXT NOT NULL DEFAULT 'HOAT_DONG',

    CONSTRAINT "PhongChieu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Phim" (
    "id" TEXT NOT NULL,
    "tenPhim" TEXT NOT NULL,
    "moTa" TEXT NOT NULL,
    "posterUrl" TEXT NOT NULL,
    "backdropUrl" TEXT,
    "trailerUrl" TEXT,
    "thoiLuong" INTEGER NOT NULL,
    "ngayKhoiChieu" TIMESTAMP(3) NOT NULL,
    "theLoai" TEXT NOT NULL,
    "ngonNgu" TEXT NOT NULL,
    "daoDien" TEXT,
    "dienVien" TEXT,
    "phanLoaiTuoi" TEXT NOT NULL,
    "giaCoBan" DOUBLE PRECISION NOT NULL,
    "trangThai" TEXT NOT NULL DEFAULT 'DANG_CHIEU',

    CONSTRAINT "Phim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoaiGhe" (
    "id" TEXT NOT NULL,
    "tenLoai" TEXT NOT NULL,
    "phuPhi" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "LoaiGhe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ghe" (
    "id" TEXT NOT NULL,
    "phongId" TEXT NOT NULL,
    "loaiGheId" TEXT NOT NULL,
    "hang" TEXT NOT NULL,
    "cot" INTEGER NOT NULL,
    "tenGhe" TEXT NOT NULL,
    "trangThai" TEXT NOT NULL DEFAULT 'HOAT_DONG',

    CONSTRAINT "Ghe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SuatChieu" (
    "id" TEXT NOT NULL,
    "phimId" TEXT NOT NULL,
    "phongId" TEXT NOT NULL,
    "thoiGianBatDau" TIMESTAMP(3) NOT NULL,
    "thoiGianKetThuc" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SuatChieu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GiuGhe" (
    "id" TEXT NOT NULL,
    "gheId" TEXT NOT NULL,
    "suatChieuId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "thoiGianGiu" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "thoiGianHetHan" TIMESTAMP(3) NOT NULL,
    "trangThai" TEXT NOT NULL DEFAULT 'DANG_GIU',

    CONSTRAINT "GiuGhe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThanhToan" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tongTien" DOUBLE PRECISION NOT NULL,
    "phuongThuc" TEXT NOT NULL,
    "trangThai" TEXT NOT NULL DEFAULT 'CHUA_THANH_TOAN',
    "thoiGian" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ThanhToan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ve" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "suatChieuId" TEXT NOT NULL,
    "gheId" TEXT NOT NULL,
    "thanhToanId" TEXT,
    "giaTien" DOUBLE PRECISION NOT NULL,
    "trangThai" TEXT NOT NULL DEFAULT 'DA_DAT',
    "thoiGianDat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ve_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PhongChieu" ADD CONSTRAINT "PhongChieu_rapId_fkey" FOREIGN KEY ("rapId") REFERENCES "RapChieu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ghe" ADD CONSTRAINT "Ghe_phongId_fkey" FOREIGN KEY ("phongId") REFERENCES "PhongChieu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ghe" ADD CONSTRAINT "Ghe_loaiGheId_fkey" FOREIGN KEY ("loaiGheId") REFERENCES "LoaiGhe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuatChieu" ADD CONSTRAINT "SuatChieu_phimId_fkey" FOREIGN KEY ("phimId") REFERENCES "Phim"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuatChieu" ADD CONSTRAINT "SuatChieu_phongId_fkey" FOREIGN KEY ("phongId") REFERENCES "PhongChieu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GiuGhe" ADD CONSTRAINT "GiuGhe_gheId_fkey" FOREIGN KEY ("gheId") REFERENCES "Ghe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GiuGhe" ADD CONSTRAINT "GiuGhe_suatChieuId_fkey" FOREIGN KEY ("suatChieuId") REFERENCES "SuatChieu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GiuGhe" ADD CONSTRAINT "GiuGhe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThanhToan" ADD CONSTRAINT "ThanhToan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ve" ADD CONSTRAINT "Ve_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ve" ADD CONSTRAINT "Ve_suatChieuId_fkey" FOREIGN KEY ("suatChieuId") REFERENCES "SuatChieu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ve" ADD CONSTRAINT "Ve_gheId_fkey" FOREIGN KEY ("gheId") REFERENCES "Ghe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ve" ADD CONSTRAINT "Ve_thanhToanId_fkey" FOREIGN KEY ("thanhToanId") REFERENCES "ThanhToan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
