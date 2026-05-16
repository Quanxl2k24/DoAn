import React from 'react';

const Footer = () => {
  return (
    <footer className="hidden md:block py-20 px-16 border-t border-white/5 bg-surface-container-low">
      {/* Sửa lại grid-cols thành 3 để 3 cột còn lại dàn đều đẹp hơn */}
      <div className="max-w-[1920px] mx-auto grid grid-cols-3 gap-12">

        {/* Cột 1: Giới thiệu */}
        <div className="col-span-1">
          <h1 className="text-2xl font-black italic text-[#E50914] tracking-tighter font-headline mb-6">CINE PREMIÈRE</h1>
          <p className="text-secondary text-sm leading-relaxed mb-6">Hệ thống rạp chiếu phim tiêu chuẩn quốc tế, mang đến trải nghiệm điện ảnh chân thực và đẳng cấp nhất.</p>
          <div className="flex gap-4">
            <a className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center hover:bg-primary-container transition-colors" href="#"><span className="material-symbols-outlined text-sm">social_leaderboard</span></a>
            <a className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center hover:bg-primary-container transition-colors" href="#"><span className="material-symbols-outlined text-sm">camera</span></a>
            <a className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center hover:bg-primary-container transition-colors" href="#"><span className="material-symbols-outlined text-sm">smart_display</span></a>
          </div>
        </div>

        {/* Cột 2: Dịch vụ */}
        <div>
          <h5 className="font-bold mb-6 tracking-widest text-xs uppercase text-primary">DỊCH VỤ</h5>
          <ul className="flex flex-col gap-4 text-sm text-secondary">
            <li><a className="hover:text-white transition-colors" href="#">Đặt vé online</a></li>
            <li><a className="hover:text-white transition-colors" href="#">Lịch chiếu phim</a></li>
            <li><a className="hover:text-white transition-colors" href="#">Rạp &amp; Giá vé</a></li>
            <li><a className="hover:text-white transition-colors" href="#">Tin điện ảnh</a></li>
          </ul>
        </div>

        {/* Cột 3: Hỗ trợ */}
        <div>
          <h5 className="font-bold mb-6 tracking-widest text-xs uppercase text-primary">HỖ TRỢ</h5>
          <ul className="flex flex-col gap-4 text-sm text-secondary">
            <li><a className="hover:text-white transition-colors" href="#">Câu hỏi thường gặp</a></li>
            <li><a className="hover:text-white transition-colors" href="#">Chính sách bảo mật</a></li>
            <li><a className="hover:text-white transition-colors" href="#">Điều khoản sử dụng</a></li>
            <li><a className="hover:text-white transition-colors" href="#">Liên hệ bản quyền</a></li>
          </ul>
        </div>

        {/* PHẦN TẢI ỨNG DỤNG ĐÃ XÓA TẠI ĐÂY */}
      </div>

      {/* PHẦN COPYRIGHT DƯỚI CÙNG ĐÃ XÓA TẠI ĐÂY */}
    </footer>
  );
};

export default Footer;