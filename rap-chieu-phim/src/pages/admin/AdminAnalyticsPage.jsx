import React, { useState } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import AdminHeader from '../../components/admin/AdminHeader';
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

        {/* Detailed KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
           {/* Card 1 */}
           <div className="bg-[#1C1B1B] p-6 rounded-2xl border border-white/5 relative overflow-hidden">
             <div className="flex justify-between items-start mb-4 relative z-10">
               <div>
                 <p className="text-sm font-bold text-gray-500 mb-1">Tổng Doanh Thu</p>
                 <h3 className="text-3xl font-black text-white">845.2M ₫</h3>
               </div>
               <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                 <span className="material-symbols-outlined">trending_up</span>
               </div>
             </div>
             <p className="text-sm text-green-500 font-bold flex items-center gap-1 relative z-10">
               <span className="material-symbols-outlined text-[16px]">arrow_upward</span> 12.5% 
               <span className="text-gray-500 font-normal ml-1">so với kỳ trước</span>
             </p>
             <div className="absolute -bottom-6 -right-6 text-white/5">
                <span className="material-symbols-outlined text-[100px]">payments</span>
             </div>
           </div>

           {/* Card 2 */}
           <div className="bg-[#1C1B1B] p-6 rounded-2xl border border-white/5 relative overflow-hidden">
             <div className="flex justify-between items-start mb-4 relative z-10">
               <div>
                 <p className="text-sm font-bold text-gray-500 mb-1">Vé Bán Ra</p>
                 <h3 className="text-3xl font-black text-white">12,450</h3>
               </div>
               <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                 <span className="material-symbols-outlined">confirmation_number</span>
               </div>
             </div>
             <p className="text-sm text-green-500 font-bold flex items-center gap-1 relative z-10">
               <span className="material-symbols-outlined text-[16px]">arrow_upward</span> 8.2% 
               <span className="text-gray-500 font-normal ml-1">so với kỳ trước</span>
             </p>
             <div className="absolute -bottom-6 -right-6 text-white/5">
                <span className="material-symbols-outlined text-[100px]">local_activity</span>
             </div>
           </div>

           {/* Card 3 */}
           <div className="bg-[#1C1B1B] p-6 rounded-2xl border border-white/5 relative overflow-hidden">
             <div className="flex justify-between items-start mb-4 relative z-10">
               <div>
                 <p className="text-sm font-bold text-gray-500 mb-1">Tỷ lệ lấp đầy</p>
                 <h3 className="text-3xl font-black text-white">68.5%</h3>
               </div>
               <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                 <span className="material-symbols-outlined">event_seat</span>
               </div>
             </div>
             <p className="text-sm text-red-500 font-bold flex items-center gap-1 relative z-10">
               <span className="material-symbols-outlined text-[16px]">arrow_downward</span> 2.1% 
               <span className="text-gray-500 font-normal ml-1">so với kỳ trước</span>
             </p>
             <div className="absolute -bottom-6 -right-6 text-white/5">
                <span className="material-symbols-outlined text-[100px]">chair</span>
             </div>
           </div>

           {/* Card 4 */}
           <div className="bg-[#1C1B1B] p-6 rounded-2xl border border-white/5 relative overflow-hidden">
             <div className="flex justify-between items-start mb-4 relative z-10">
               <div>
                 <p className="text-sm font-bold text-gray-500 mb-1">Thành viên mới</p>
                 <h3 className="text-3xl font-black text-white">845</h3>
               </div>
               <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                 <span className="material-symbols-outlined">group_add</span>
               </div>
             </div>
             <p className="text-sm text-green-500 font-bold flex items-center gap-1 relative z-10">
               <span className="material-symbols-outlined text-[16px]">arrow_upward</span> 15.3% 
               <span className="text-gray-500 font-normal ml-1">so với kỳ trước</span>
             </p>
             <div className="absolute -bottom-6 -right-6 text-white/5">
                <span className="material-symbols-outlined text-[100px]">person_add</span>
             </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-[#1C1B1B] rounded-2xl border border-white/5 p-6">
             <h3 className="font-headline font-bold text-lg text-white mb-6">Biểu đồ doanh thu</h3>
             <RevenueChart />
          </div>
          <div className="bg-[#1C1B1B] rounded-2xl border border-white/5 p-6">
             <h3 className="font-headline font-bold text-lg text-white mb-6">Phim thịnh hành</h3>
             <TopPerformers />
          </div>
        </div>
      </main>
    </>
  );
};

export default AdminAnalyticsPage;
