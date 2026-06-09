import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const RevenueChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/admin/analytics/weekly-revenue');
        setChartData(res.data.data);
      } catch (err) {
        console.error('Lỗi tải biểu đồ:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const maxValue = chartData?.length ? Math.max(...chartData.map(d => d.revenue), 1) : 1;

  const fmt = (value) => {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}Tr`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
    return value.toLocaleString('vi-VN');
  };

  const isToday = (day) => {
    const today = new Date().toISOString().split('T')[0];
    return day === today;
  };

  return (
    <div className="lg:col-span-2 bg-surface-container-lowest p-8 rounded-xl border border-white/5">
      <div className="flex justify-between items-center mb-10">
        <h2 className="font-headline text-xl font-bold tracking-tight">DOANH THU TUẦN</h2>
        <span className="text-xs text-gray-500">7 ngày trong tuần</span>
      </div>
      <div className="flex items-end justify-between h-64 gap-4 px-2">
        {loading ? (
          <div className="w-full text-center text-secondary">Đang tải...</div>
        ) : chartData?.length > 0 ? (
          chartData.map((item) => {
            const heightPercent = Math.max((item.revenue / maxValue) * 100, 3);
            const today = isToday(item.day);
            return (
              <div key={item.day} className="flex-1 flex flex-col items-center gap-4 h-full justify-end">
                <div
                  className={`w-full rounded-t-sm transition-colors group relative cursor-pointer ${
                    today
                      ? 'bg-[#E50914] hover:bg-red-600'
                      : 'bg-primary-container hover:bg-red-600'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                >
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-surface-container-highest px-3 py-1.5 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg pointer-events-none">
                    <div className="text-[#E50914]">{fmt(item.revenue)}đ</div>
                    <div className="text-gray-400 text-[10px]">{item.label} - {item.date}</div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <span className={`text-[10px] font-bold leading-tight ${
                    today ? 'text-[#E50914]' : 'text-gray-500'
                  }`}>
                    {item.label}
                  </span>
                  <span className="text-[8px] text-gray-600">{item.date}</span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="w-full text-center text-secondary py-12">Chưa có dữ liệu</div>
        )}
      </div>
    </div>
  );
};

export default RevenueChart;