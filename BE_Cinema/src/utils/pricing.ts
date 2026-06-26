const PHU_PHI_VIP = 20000;
const PHU_PHI_DOI = 40000;
const PHU_PHI_THUONG = 0;

const PHU_PHI_TRUOC_17H = 0;
const PHU_PHI_17H_DEN_22H = 15000;
const PHU_PHI_SAU_22H = 10000;

const PHU_PHI_THU_2_DEN_THU_6 = 0;
const PHU_PHI_THU_7_CHU_NHAT = 15000;
const PHU_PHI_NGAY_LE = 25000;

export function tinhPhuPhiLoaiGhe(tenLoai: string): number {
  switch (tenLoai) {
    case "VIP":
      return PHU_PHI_VIP;
    case "SWEETBOX":
      return PHU_PHI_DOI;
    default:
      return PHU_PHI_THUONG;
  }
}

export function tinhPhuPhiTheoGio(gio: number): number {
  if (gio < 17) return PHU_PHI_TRUOC_17H;
  if (gio >= 17 && gio < 22) return PHU_PHI_17H_DEN_22H;
  return PHU_PHI_SAU_22H;
}

export function tinhPhuPhiTheoNgay(ngay: Date): number {
  const thu = ngay.getDay();
  if (thu === 6 || thu === 0) return PHU_PHI_THU_7_CHU_NHAT;
  return PHU_PHI_THU_2_DEN_THU_6;
}

export function tinhPhuPhiNgayLe(ngay: Date, danhSachNgayLe: Date[]): number {
  const target = new Date(ngay);
  target.setHours(0, 0, 0, 0);

  for (const le of danhSachNgayLe) {
    const leDate = new Date(le);
    leDate.setHours(0, 0, 0, 0);
    if (target.getTime() === leDate.getTime()) {
      return PHU_PHI_NGAY_LE;
    }
  }
  return 0;
}

export function tinhGiaVe(
  giaCoBan: number,
  loaiGhe: string,
  gioBatDau: number,
  ngayChieu: Date,
  danhSachNgayLe?: Date[],
  apDungPhuPhiCuoiTuan: boolean = true,
  apDungPhuPhiNgayLe: boolean = true,
  apDungPhuPhiTheoGio: boolean = true
): number {
  const phuPhiGhe = tinhPhuPhiLoaiGhe(loaiGhe);
  const phuPhiTime = apDungPhuPhiTheoGio ? tinhPhuPhiTheoGio(gioBatDau) : 0;

  let phuPhiNgay = 0;
  if (apDungPhuPhiNgayLe && danhSachNgayLe) {
    phuPhiNgay = tinhPhuPhiNgayLe(ngayChieu, danhSachNgayLe);
  }
  if (phuPhiNgay === 0 && apDungPhuPhiCuoiTuan) {
    phuPhiNgay = tinhPhuPhiTheoNgay(ngayChieu);
  }

  return giaCoBan + phuPhiGhe + phuPhiTime + phuPhiNgay;
}
