import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Phim' },
    { to: '/showtimes', label: 'Lịch Chiếu' },
    { to: '/showtimes', label: 'Rạp' },
    { to: '/history', label: 'Vé Của Tôi' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#131313] dark:bg-neutral-950/80 backdrop-blur-xl shadow-2xl shadow-black/50">
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-[1920px] mx-auto">
        <div className="flex items-center gap-12">
          <Link to="/" className="text-2xl font-black italic text-[#E50914] tracking-tighter font-headline">
            CINE PREMIÈRE
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`font-bold font-headline tracking-tighter hover:scale-105 duration-300 transition-all ${location.pathname === '/' ? 'text-[#E50914] border-b-2 border-[#E50914] pb-1' : 'text-neutral-400 hover:text-white'}`}
            >
              Phim
            </Link>
            <Link
              to="/showtimes"
              className={`font-headline tracking-tighter hover:scale-105 duration-300 transition-all ${location.pathname === '/showtimes' ? 'text-[#E50914] border-b-2 border-[#E50914] pb-1 font-bold' : 'text-neutral-400 hover:text-white'}`}
            >
              Lịch Chiếu
            </Link>
            {user && (
              <Link
                to="/history"
                className={`font-headline tracking-tighter hover:scale-105 duration-300 transition-all ${location.pathname === '/history' ? 'text-[#E50914] border-b-2 border-[#E50914] pb-1 font-bold' : 'text-neutral-400 hover:text-white'}`}
              >
                Vé Của Tôi
              </Link>
            )}
            {user?.role?.name === 'ADMIN' && (
              <Link
                to="/admin"
                className={`font-headline tracking-tighter hover:scale-105 duration-300 transition-all ${location.pathname.startsWith('/admin') ? 'text-[#E50914] border-b-2 border-[#E50914] pb-1 font-bold' : 'text-neutral-400 hover:text-white'}`}
              >
                Quản Trị
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center bg-surface-container-high rounded-full px-4 py-2 gap-2 border border-white/5">
            <span className="material-symbols-outlined text-secondary opacity-70">search</span>
            <input className="bg-transparent border-none focus:outline-none text-sm w-64 placeholder:text-neutral-500" placeholder="Tìm tên phim, diễn viên..." type="text" />
          </div>
          <div className="flex items-center gap-4 text-on-surface">
            {user ? (
              <>
                <Link to="/history" className="hover:scale-105 transition-transform duration-300">
                  <span className="material-symbols-outlined">receipt_long</span>
                </Link>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold hidden md:block">{user.fullName || user.email}</span>
                  <button onClick={logout} className="text-sm text-[#E50914] hover:underline">Đăng xuất</button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-[#E50914] text-white px-4 py-2 rounded-md font-bold text-sm hover:bg-red-700 transition-colors"
              >
                ĐĂNG NHẬP
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;