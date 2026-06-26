/*
  Warnings:

  - You are about to drop the column `heSoGia` on the `SuatChieu` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Phim" ADD COLUMN     "dinhDang" TEXT NOT NULL DEFAULT '2D';

-- AlterTable
ALTER TABLE "SuatChieu" DROP COLUMN "heSoGia";

-- CreateTable
CREATE TABLE "NgayLe" (
    "id" TEXT NOT NULL,
    "tenNgayLe" TEXT NOT NULL,
    "ngay" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NgayLe_pkey" PRIMARY KEY ("id")
);
