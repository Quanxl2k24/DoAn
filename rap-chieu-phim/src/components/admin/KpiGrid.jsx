import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const KpiGrid = ({ days = 7 }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/admin/analytics?days=${days}`);
        setData(res.data.data);
      } catch (err) {
        console.error('Lỗi tải KPI:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [days]);

  const formatCurrency = (value) => {
    if (!value) return '0';
    if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`;
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}Tr`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toLocaleString('vi-VN');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
      <div className="bg-surface-container-low p-8 rounded-xl border border-white/5">
        <div className="flex justify-between items-start mb-6">
          <span className="material-symbols-outlined text-tertiary">payments</span>
        </div>
        <p className="text-on-surface-variant text-xs uppercase tracking-widest mb-1">TỔNG DOANH THU</p>
        <h3 className="text-4xl font-headline font-black">
          {loading ? '...' : `${formatCurrency(data?.totalRevenue)}`}
        </h3>
      </div>
      <div className="bg-surface-container-low p-8 rounded-xl border border-white/5">
        <div className="flex justify-between items-start mb-6">
          <span className="material-symbols-outlined text-primary">confirmation_number</span>
        </div>
        <p className="text-on-surface-variant text-xs uppercase tracking-widest mb-1">TỔNG SỐ VÉ</p>
        <h3 className="text-4xl font-headline font-black">
          {loading ? '...' : (data?.totalTickets ?? 0).toLocaleString('vi-VN')}
        </h3>
      </div>
      <div className="bg-surface-container-low p-8 rounded-xl border border-white/5">
        <div className="flex justify-between items-start mb-6">
          <span className="material-symbols-outlined text-secondary">movie</span>
        </div>
        <p className="text-on-surface-variant text-xs uppercase tracking-widest mb-1">PHIM ĐANG CHIẾU</p>
        <h3 className="text-4xl font-headline font-black">
          {loading ? '...' : (data?.totalMovies ?? 0)}
        </h3>
      </div>
      <div className="bg-surface-container-low p-8 rounded-xl border border-white/5">
        <div className="flex justify-between items-start mb-6">
          <span className="material-symbols-outlined text-error">chair</span>
        </div>
        <p className="text-on-surface-variant text-xs uppercase tracking-widest mb-1">TỶ LỆ LẤP ĐẦY</p>
        <h3 className="text-4xl font-headline font-black">
          {loading ? '...' : `${data?.occupancyRate ?? 0}%`}
        </h3>
      </div>
    </div>
  );
};

export default KpiGrid;
