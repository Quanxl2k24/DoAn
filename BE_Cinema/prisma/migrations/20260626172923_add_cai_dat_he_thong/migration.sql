-- CreateTable
CREATE TABLE "CaiDatHeThong" (
    "id" TEXT NOT NULL,
    "apDungPhuPhiCuoiTuan" BOOLEAN NOT NULL DEFAULT true,
    "apDungPhuPhiNgayLe" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "CaiDatHeThong_pkey" PRIMARY KEY ("id")
);
