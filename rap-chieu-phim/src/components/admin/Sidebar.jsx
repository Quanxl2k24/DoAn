import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const getLinkClass = (path) => {
    const isActive = location.pathname === path || (path !== '/admin' && location.pathname.startsWith(path));
    if (isActive) {
      return "flex items-center gap-4 bg-[#E50914] text-white rounded-r-full mr-4 px-8 py-3 transition-transform active:translate-x-1";
    }
    return "flex items-center gap-4 text-gray-500 hover:text-white hover:bg-[#2A2A2A] px-8 py-3 transition-all";
  };

  return (
    <nav className="h-screen w-64 fixed left-0 top-0 bg-[#1C1B1B] border-r border-white/5 flex flex-col py-8 z-50">
      <div className="px-8 mb-12">
        <Link to="/admin">
          <span className="font-headline font-black text-xl text-[#E50914] tracking-tighter">NOIR CINEMA</span>
        </Link>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto hide-scrollbar">
        <Link className={getLinkClass('/admin')} to="/admin">
          <span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
          <span className="font-body font-medium">Tổng quan</span>
        </Link>
        <Link className={getLinkClass('/admin/theaters')} to="/admin/theaters">
          <span className="material-symbols-outlined" data-icon="theater_comedy">theater_comedy</span>
          <span className="font-body font-medium">Rạp chiếu</span>
        </Link>
        <Link className={getLinkClass('/admin/rooms')} to="/admin/rooms">
          <span className="material-symbols-outlined" data-icon="meeting_room">meeting_room</span>
          <span className="font-body font-medium">Phòng chiếu</span>
        </Link>
        <Link className={getLinkClass('/admin/seat-types')} to="/admin/seat-types">
          <span className="material-symbols-outlined" data-icon="chair">chair</span>
          <span className="font-body font-medium">Loại ghế</span>
        </Link>
        <Link className={getLinkClass('/admin/schedules')} to="/admin/schedules">
          <span className="material-symbols-outlined" data-icon="calendar_today">calendar_today</span>
          <span className="font-body font-medium">Lịch chiếu</span>
        </Link>
        <Link className={getLinkClass('/admin/movies')} to="/admin/movies">
          <span className="material-symbols-outlined" data-icon="movie">movie</span>
          <span className="font-body font-medium">Phim</span>
        </Link>
        <Link className={getLinkClass('/admin/bookings')} to="/admin/bookings">
          <span className="material-symbols-outlined" data-icon="confirmation_number">confirmation_number</span>
          <span className="font-body font-medium">Giao dịch</span>
        </Link>
        <Link className={getLinkClass('/admin/analytics')} to="/admin/analytics">
          <span className="material-symbols-outlined" data-icon="analytics">analytics</span>
          <span className="font-body font-medium">Thống kê</span>
        </Link>
      </div>
      <div className="mt-auto pt-8 border-t border-white/5 px-8 flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden">
          <img alt="Admin Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFbfWD4ZWQpMd6uioEjYlKYzXuhJ_Ypv4wIdBfheaYLwKQaYmQdB0i1YQEg9kiWQMqZPOJYpVpHAmCfvI1izeU24mJlB2C9txsZA5pozFmmUfOkaGQmebFbGgPyXAACzJ-MtCix6DqzGy11hFwqySsstRFrlDJmNbfbq5ErNWXZ4V2iWYY4Zt3F1vPklhiBWNNrVpujisdcGZAF0slEJG2J1WOU6xHmfwMyg1sCHiwTzh-Xn9Cm_UQNwDka3pzEPt2mv2T_ELR1Uk" />
        </div>
        <div>
          <p className="text-sm font-bold text-white">{user?.fullName || user?.email || 'Admin'}</p>
          <p className="text-xs text-gray-500">{user?.role?.name || 'Quản trị viên'}</p>
        </div>
      </div>
      <div className="space-y-1">
        <button
          onClick={logout}
          className="w-full flex items-center gap-4 text-gray-500 hover:text-white hover:bg-[#2A2A2A] px-8 py-3 transition-all"
        >
          <span className="material-symbols-outlined" data-icon="logout">logout</span>
          <span className="font-body font-medium text-sm">Đăng xuất</span>
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;
