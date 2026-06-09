import React, { useState } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import KpiGrid from '../../components/admin/KpiGrid';
import RevenueChart from '../../components/admin/RevenueChart';
import TopPerformers from '../../components/admin/TopPerformers';

const AdminAnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('7days');

  return (
    <>
      <Sidebar />
      <main className="ml-64 p-12 min-h-screen bg-[#131313]">
        <AdminHeader />
        
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="font-headline text-3xl font-bold text-white mb-2">Báo cáo Phân tích</h1>
            <p className="text-gray-400">Đánh giá doanh thu và hiệu suất rạp chiếu</p>
          </div>
          
          <div className="flex bg-[#1C1B1B] rounded-lg border border-white/5 overflow-hidden">
            <button 
              className={`px-4 py-2 text-sm font-bold transition-colors ${timeRange === '7days' ? 'bg-[#E50914] text-white' : 'text-gray-500 hover:text-gray-300'}`}
              onClick={() => setTimeRange('7days')}
            >7 ngày qua</button>
            <button 
              className={`px-4 py-2 text-sm font-bold transition-colors border-l border-white/5 ${timeRange === '30days' ? 'bg-[#E50914] text-white' : 'text-gray-500 hover:text-gray-300'}`}
              onClick={() => setTimeRange('30days')}
            >30 ngày qua</button>
            <button 
              className={`px-4 py-2 text-sm font-bold transition-colors border-l border-white/5 ${timeRange === 'year' ? 'bg-[#E50914] text-white' : 'text-gray-500 hover:text-gray-300'}`}
              onClick={() => setTimeRange('year')}
            >Năm nay</button>
          </div>
        </div>

        <KpiGrid days={timeRange === 'year' ? 365 : timeRange === '30days' ? 30 : 7} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <RevenueChart />
          <TopPerformers days={timeRange === 'year' ? 365 : timeRange === '30days' ? 30 : 7} />
        </div>
      </main>
    </>
  );
};

export default AdminAnalyticsPage;
