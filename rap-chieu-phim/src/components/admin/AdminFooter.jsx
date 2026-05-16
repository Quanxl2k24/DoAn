import React from 'react';

const AdminFooter = () => {
  return (
    <footer className="ml-64 border-t border-white/5 py-12 px-12 bg-surface">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 max-w-[1440px] mx-auto">
        {/* Logo bên trái */}
        <span className="text-[#E50914] font-headline font-bold tracking-tighter">
          NOIR CINEMA
        </span>

        {/* Các liên kết ở bên phải */}
        <div className="flex gap-8">
          <a className="font-body text-xs uppercase tracking-widest text-gray-600 hover:text-[#E50914] transition-colors" href="#">Chính sách bảo mật</a>
          <a className="font-body text-xs uppercase tracking-widest text-gray-600 hover:text-[#E50914] transition-colors" href="#">Điều khoản dịch vụ</a>
          <a className="font-body text-xs uppercase tracking-widest text-gray-600 hover:text-[#E50914] transition-colors" href="#">Báo chí</a>
          <a className="font-body text-xs uppercase tracking-widest text-gray-600 hover:text-[#E50914] transition-colors" href="#">Liên hệ</a>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;