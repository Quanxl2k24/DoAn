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
    const today = new Date().toLocaleDateString('en-CA');
    return day === today;
  };

  return (
    <div className="lg:col-span-2 bg-surface-container-lowest p-8 rounded-xl border border-white/5 flex flex-col h-full">
      <div className="flex justify-between items-center mb-10 flex-shrink-0">
        <h2 className="font-headline text-xl font-bold tracking-tight">DOANH THU TUẦN</h2>
        <span className="text-xs text-gray-500">7 ngày trong tuần</span>
      </div>
      <div className="flex items-end justify-between gap-4 px-2 flex-1">
        {loading ? (
          <div className="w-full text-center text-secondary self-center">Đang tải...</div>
        ) : chartData?.length > 0 ? (
          chartData.map((item) => {
            const pct = maxValue > 0 ? (item.revenue / maxValue) * 100 : 0;
            const today = isToday(item.day);
            return (
              <div key={item.day} className="flex-1 flex flex-col items-center justify-end gap-0.5 h-full">
                <span className={`text-[10px] font-black leading-tight ${
                  today ? 'text-[#E50914]' : 'text-gray-400'
                }`}>
                  {fmt(item.revenue)}đ
                </span>
                <div
                  className="w-full rounded-t-sm bg-[#E50914] transition-all flex-shrink-0"
                  style={{ height: `${Math.max(pct * 0.75, 3)}%`, minHeight: item.revenue > 0 ? '20px' : '4px' }}
                />
                <div className="flex flex-col items-center gap-0">
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
          <div className="w-full text-center text-secondary py-12 self-center">Chưa có dữ liệu</div>
        )}
      </div>
    </div>
  );
};

export default RevenueChart;