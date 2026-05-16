import React from 'react';

const KpiGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
      {/* Total Revenue */}
      <div className="bg-surface-container-low p-8 rounded-xl border border-white/5">
        <div className="flex justify-between items-start mb-6">
          <span className="material-symbols-outlined text-tertiary" data-icon="payments">payments</span>
          <span className="text-tertiary text-xs font-bold font-body">+12.5%</span>
        </div>
        <p className="text-on-surface-variant text-xs uppercase tracking-widest mb-1">TỔNG DOANH THU</p>
        <h3 className="text-4xl font-headline font-black">142.85Tr</h3>
      </div>
      {/* Total Bookings */}
      <div className="bg-surface-container-low p-8 rounded-xl border border-white/5">
        <div className="flex justify-between items-start mb-6">
          <span className="material-symbols-outlined text-primary" data-icon="confirmation_number">confirmation_number</span>
          <span className="text-primary text-xs font-bold font-body">+8.2%</span>
        </div>
        <p className="text-on-surface-variant text-xs uppercase tracking-widest mb-1">TỔNG SỐ VÉ</p>
        <h3 className="text-4xl font-headline font-black">12,402</h3>
      </div>
      {/* Active Movies */}
      <div className="bg-surface-container-low p-8 rounded-xl border border-white/5">
        <div className="flex justify-between items-start mb-6">
          <span className="material-symbols-outlined text-secondary" data-icon="movie">movie</span>
          <span className="text-secondary text-xs font-bold font-body">Ổn định</span>
        </div>
        <p className="text-on-surface-variant text-xs uppercase tracking-widest mb-1">PHIM ĐANG CHIẾU</p>
        <h3 className="text-4xl font-headline font-black">24</h3>
      </div>
      {/* Occupancy Rate */}
      <div className="bg-surface-container-low p-8 rounded-xl border border-white/5">
        <div className="flex justify-between items-start mb-6">
          <span className="material-symbols-outlined text-error" data-icon="chair">chair</span>
          <span className="text-error text-xs font-bold font-body">-2.1%</span>
        </div>
        <p className="text-on-surface-variant text-xs uppercase tracking-widest mb-1">TỶ LỆ LẤP ĐẦY</p>
        <h3 className="text-4xl font-headline font-black">76.4%</h3>
      </div>
    </div>
  );
};

export default KpiGrid;
