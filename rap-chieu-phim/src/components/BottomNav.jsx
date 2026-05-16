import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const BottomNav = () => {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { to: '/', icon: 'movie', label: 'Khám Phá' },
    { to: '/showtimes', icon: 'confirmation_number', label: 'Đặt Vé' },
    { to: '/history', icon: 'receipt_long', label: 'Vé Của Tôi' },
    { to: user ? '/history' : '/login', icon: 'person', label: 'Cá Nhân' },
  ];

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-[#1C1B1B]/90 backdrop-blur-2xl rounded-t-3xl border-t border-white/5 shadow-[0_-10px_40px_rgba(0,0,0,0.6)] flex justify-around items-center px-4 pb-6 pt-3">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to + item.label}
              to={item.to}
              className={`flex flex-col items-center justify-center transition-all ${
                isActive
                  ? 'text-[#E50914] drop-shadow-[0_0_8px_rgba(229,9,20,0.4)]'
                  : 'text-neutral-500 hover:text-white'
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              <span className="font-label text-[10px] font-bold uppercase tracking-widest mt-1">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
      {/* Floating Action Button */}
      <div className="fixed bottom-28 right-6 md:bottom-10 md:right-10 z-40 md:hidden">
        <Link
          to="/showtimes"
          className="bg-[#E50914] text-white p-4 rounded-full shadow-2xl shadow-[#E50914]/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined">confirmation_number</span>
        </Link>
      </div>
    </>
  );
};

export default BottomNav;

