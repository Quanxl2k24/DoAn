import React from 'react';

const RecentTransactions = () => {
  return (
    <div className="mt-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-headline text-2xl font-black tracking-tighter">GIAO DỊCH GẦN ĐÂY</h2>
        <button className="text-primary text-xs font-bold tracking-widest uppercase hover:underline">Xem tất cả</button>
      </div>
      <div className="bg-surface-container-low rounded-xl overflow-hidden border border-white/5 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead className="bg-surface-container-lowest">
            <tr>
              <th className="px-8 py-4 text-[10px] font-black tracking-widest text-gray-500 uppercase">Khách hàng</th>
              <th className="px-8 py-4 text-[10px] font-black tracking-widest text-gray-500 uppercase">Phim</th>
              <th className="px-8 py-4 text-[10px] font-black tracking-widest text-gray-500 uppercase">Ghế</th>
              <th className="px-8 py-4 text-[10px] font-black tracking-widest text-gray-500 uppercase">Tổng tiền</th>
              <th className="px-8 py-4 text-[10px] font-black tracking-widest text-gray-500 uppercase">Trạng thái</th>
              <th className="px-8 py-4 text-[10px] font-black tracking-widest text-gray-500 uppercase text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr className="hover:bg-[#2A2A2A] transition-colors group">
              <td className="px-8 py-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-xs">JD</div>
                  <span className="font-bold text-sm">Julianne Devis</span>
                </div>
              </td>
              <td className="px-8 py-5 text-sm font-medium">Mắt Biếc</td>
              <td className="px-8 py-5 text-sm text-gray-400">H12, H13, H14</td>
              <td className="px-8 py-5 text-sm font-bold">450.000đ</td>
              <td className="px-8 py-5">
                <span className="bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded-full text-[10px] font-black uppercase">Đã xác nhận</span>
              </td>
              <td className="px-8 py-5 text-right">
                <button className="material-symbols-outlined text-gray-500 hover:text-white" data-icon="more_vert">more_vert</button>
              </td>
            </tr>
            <tr className="hover:bg-[#2A2A2A] transition-colors group">
              <td className="px-8 py-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-xs">MA</div>
                  <span className="font-bold text-sm">Marcus Aurel</span>
                </div>
              </td>
              <td className="px-8 py-5 text-sm font-medium">Mai</td>
              <td className="px-8 py-5 text-sm text-gray-400">A01, A02</td>
              <td className="px-8 py-5 text-sm font-bold">300.000đ</td>
              <td className="px-8 py-5">
                <span className="bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded-full text-[10px] font-black uppercase">Đã xác nhận</span>
              </td>
              <td className="px-8 py-5 text-right">
                <button className="material-symbols-outlined text-gray-500 hover:text-white" data-icon="more_vert">more_vert</button>
              </td>
            </tr>
            <tr className="hover:bg-[#2A2A2A] transition-colors group">
              <td className="px-8 py-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-xs">SK</div>
                  <span className="font-bold text-sm">Sarah Kim</span>
                </div>
              </td>
              <td className="px-8 py-5 text-sm font-medium">Đào, Phở và Piano</td>
              <td className="px-8 py-5 text-sm text-gray-400">C08</td>
              <td className="px-8 py-5 text-sm font-bold">150.000đ</td>
              <td className="px-8 py-5">
                <span className="bg-error-container text-on-error-container px-3 py-1 rounded-full text-[10px] font-black uppercase">Chờ xử lý</span>
              </td>
              <td className="px-8 py-5 text-right">
                <button className="material-symbols-outlined text-gray-500 hover:text-white" data-icon="more_vert">more_vert</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTransactions;
