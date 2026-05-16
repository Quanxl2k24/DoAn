import React from 'react';

const RevenueChart = () => {
  return (
    <div className="lg:col-span-2 bg-surface-container-lowest p-8 rounded-xl border border-white/5">
      <div className="flex justify-between items-center mb-10">
        <h2 className="font-headline text-xl font-bold tracking-tight">DOANH THU TUẦN</h2>
        <select className="bg-white text-black border border-neutral-300 rounded px-2 py-1 text-xs font-bold uppercase tracking-widest cursor-pointer">
          <option>7 Ngày Qua</option>
          <option>30 Ngày Qua</option>
        </select>
      </div>
      <div className="flex items-end justify-between h-64 gap-4 px-2">
        {/* Monday */}
        <div className="flex-1 flex flex-col items-center gap-4 h-full justify-end">
          <div className="w-full bg-surface-container-high h-[40%] rounded-t-sm hover:bg-primary-container transition-colors group relative">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-surface-container-highest px-2 py-1 rounded text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">12Tr</div>
          </div>
          <span className="text-[10px] font-bold text-gray-600 uppercase">T2</span>
        </div>
        {/* Tuesday */}
        <div className="flex-1 flex flex-col items-center gap-4 h-full justify-end">
          <div className="w-full bg-surface-container-high h-[65%] rounded-t-sm hover:bg-primary-container transition-colors group relative">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-surface-container-highest px-2 py-1 rounded text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">18Tr</div>
          </div>
          <span className="text-[10px] font-bold text-gray-600 uppercase">T3</span>
        </div>
        {/* Wednesday */}
        <div className="flex-1 flex flex-col items-center gap-4 h-full justify-end">
          <div className="w-full bg-surface-container-high h-[55%] rounded-t-sm hover:bg-primary-container transition-colors group relative">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-surface-container-highest px-2 py-1 rounded text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">15Tr</div>
          </div>
          <span className="text-[10px] font-bold text-gray-600 uppercase">T4</span>
        </div>
        {/* Thursday */}
        <div className="flex-1 flex flex-col items-center gap-4 h-full justify-end">
          <div className="w-full bg-surface-container-high h-[85%] rounded-t-sm hover:bg-primary-container transition-colors group relative">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-surface-container-highest px-2 py-1 rounded text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">24Tr</div>
          </div>
          <span className="text-[10px] font-bold text-gray-600 uppercase">T5</span>
        </div>
        {/* Friday */}
        <div className="flex-1 flex flex-col items-center gap-4 h-full justify-end">
          <div className="w-full bg-primary-container h-[95%] rounded-t-sm group relative">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-surface-container-highest px-2 py-1 rounded text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">28Tr</div>
          </div>
          <span className="text-[10px] font-bold text-gray-600 uppercase">T6</span>
        </div>
        {/* Saturday */}
        <div className="flex-1 flex flex-col items-center gap-4 h-full justify-end">
          <div className="w-full bg-primary-container h-[100%] rounded-t-sm group relative">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-surface-container-highest px-2 py-1 rounded text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">32Tr</div>
          </div>
          <span className="text-[10px] font-bold text-gray-600 uppercase">T7</span>
        </div>
        {/* Sunday */}
        <div className="flex-1 flex flex-col items-center gap-4 h-full justify-end">
          <div className="w-full bg-primary-container h-[90%] rounded-t-sm group relative">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-surface-container-highest px-2 py-1 rounded text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">26Tr</div>
          </div>
          <span className="text-[10px] font-bold text-gray-600 uppercase">CN</span>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
