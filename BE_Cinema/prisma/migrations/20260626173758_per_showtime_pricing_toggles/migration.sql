/*
  Warnings:

  - You are about to drop the `CaiDatHeThong` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "SuatChieu" ADD COLUMN     "apDungPhuPhiCuoiTuan" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "apDungPhuPhiNgayLe" BOOLEAN NOT NULL DEFAULT true;

-- DropTable
DROP TABLE "CaiDatHeThong";
