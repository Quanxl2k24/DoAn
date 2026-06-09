import React from 'react';
import { Link } from 'react-router-dom';

const AdminHeader = ({ title, subtitle, children }) => {
  return (
    <header className="flex justify-between items-end mb-16">
      <div>
        <h1 className="text-5xl font-headline font-black tracking-tighter mb-2">{title || 'TỔNG QUAN'}</h1>
        <p className="text-on-surface-variant font-body uppercase tracking-widest text-xs opacity-70">{subtitle || 'Báo cáo chiến lược & Số liệu cốt lõi'}</p>
      </div>
      {children || (
        <Link to="/admin/schedules" className="bg-primary-container text-on-primary-container px-6 py-3 rounded-md font-bold text-sm flex items-center gap-2 hover:scale-105 transition-transform">
          <span className="material-symbols-outlined text-sm" data-icon="add">add</span>
          THÊM SUẤT CHIẾU
        </Link>
      )}
    </header>
  );
};

export default AdminHeader;
