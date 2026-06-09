import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import { SkeletonTable } from '../../components/Skeleton';
import Pagination from '../../components/Pagination';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const AdminBookingsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 0 });

  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const fetchData = useCallback(async (page = 1) => {
    setSearchLoading(true);
    try {
      const params = { page, limit: 15 };
      if (searchKeyword.trim()) params.search = searchKeyword.trim();
      if (filterStatus !== 'all') params.trangThai = filterStatus === 'success' ? 'THANH_CONG' : 'THAT_BAI';
      if (fromDate) params.fromDate = fromDate;
      if (toDate) params.toDate = toDate;

      const res = await api.get('/dat-ve/admin/lich-su', { params });
      setTransactions(res.data.data || []);
      setPagination(res.data.pagination || { page: 1, limit: 15, total: 0, totalPages: 0 });
      setCurrentPage(page);
    } catch (err) {
      toast.error('Lỗi tải danh sách đặt vé');
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  }, [searchKeyword, filterStatus, fromDate, toDate]);

  useEffect(() => {
    setLoading(true);
    setCurrentPage(1);
    const timer = setTimeout(() => fetchData(1), 400);
    return () => clearTimeout(timer);
  }, [searchKeyword, filterStatus, fromDate, toDate]);

  useEffect(() => {
    fetchData(1);
  }, []);

  const handlePageChange = (page) => {
    fetchData(page);
  };

  const handleFilterChange = (val) => {
    setFilterStatus(val);
    setCurrentPage(1);
  };

  return (
    <>
      <Sidebar />
      <main className="ml-64 p-12 min-h-screen bg-surface">
        <AdminHeader title="QUẢN LÝ ĐẶT VÉ" subtitle="Theo dõi toàn bộ giao dịch đặt vé trên hệ thống" />

        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="font-headline text-3xl font-bold text-on-surface mb-2">Quản lý Đặt vé</h1>
            <p className="text-secondary opacity-70">Theo dõi toàn bộ giao dịch đặt vé trên hệ thống</p>
          </div>

          <div className="flex bg-surface-container-low rounded-lg border border-white/5 overflow-hidden">
            {[['all','Tất cả'],['success','Thành công'],['cancel','Đã hủy']].map(([val, label]) => (
              <button
                key={val}
                className={`px-4 py-2 text-sm font-bold transition-colors border-l border-white/5 first:border-l-0 ${filterStatus === val ? 'bg-white/10 text-on-surface' : 'text-secondary hover:text-on-surface'}`}
                onClick={() => handleFilterChange(val)}
              >{label}</button>
            ))}
          </div>
        </div>

        <div className="bg-surface-container-low rounded-2xl border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px] bg-white border border-neutral-300 rounded-lg flex items-center px-4 py-2 gap-2">
              <span className="material-symbols-outlined text-secondary">search</span>
              <input
                type="text"
                placeholder="Tìm theo mã GD, email, tên khách hàng, tên phim..."
                className="bg-transparent border-none outline-none text-black placeholder-gray-400 w-full text-sm"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
              {searchLoading && (
                <span className="material-symbols-outlined text-secondary animate-spin text-lg">refresh</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-secondary">Từ:</span>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="bg-white border border-neutral-300 text-black px-3 py-2 rounded-lg text-sm"
              />
              <span className="text-xs text-secondary">Đến:</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="bg-white border border-neutral-300 text-black px-3 py-2 rounded-lg text-sm"
              />
              {(fromDate || toDate) && (
                <button
                  onClick={() => { setFromDate(''); setToDate(''); }}
                  className="text-xs text-[#E50914] hover:underline whitespace-nowrap"
                >
                  Xoá bộ lọc
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <SkeletonTable rows={8} cols={6} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 text-secondary text-sm border-b border-white/5">
                    <th className="p-6 font-medium">Mã GD</th>
                    <th className="p-6 font-medium">Khách hàng</th>
                    <th className="p-6 font-medium">Phim</th>
                    <th className="p-6 font-medium">Ghế</th>
                    <th className="p-6 font-medium">Thanh Toán</th>
                    <th className="p-6 font-medium">Tổng Tiền</th>
                    <th className="p-6 font-medium">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-on-surface text-sm">
                  {transactions.length === 0 ? (
                    <tr><td colSpan={7} className="p-12 text-center text-secondary">Không có giao dịch nào</td></tr>
                  ) : transactions.map((txn) => {
                    const phim = txn.ves?.[0]?.suatChieu?.phim;
                    const ghes = txn.ves?.map(v => v.ghe?.tenGhe).filter(Boolean).join(', ') || 'N/A';
                    return (
                      <tr key={txn.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="p-6 font-bold text-secondary font-mono text-xs">{txn.id.slice(0, 8).toUpperCase()}</td>
                        <td className="p-6">
                          <div className="font-bold">{txn.user?.fullName || 'N/A'}</div>
                          <div className="text-xs text-secondary mt-1">{txn.user?.email || ''}</div>
                        </td>
                        <td className="p-6">
                          <div className="font-bold max-w-[200px] truncate">{phim?.tenPhim || 'N/A'}</div>
                          <div className="text-xs text-secondary mt-1">
                            {new Date(txn.thoiGian).toLocaleDateString('vi-VN')}
                          </div>
                        </td>
                        <td className="p-6 text-secondary">{ghes}</td>
                        <td className="p-6">
                          <div className="flex items-center gap-2 text-secondary">
                            <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
                            {txn.phuongThuc}
                          </div>
                        </td>
                        <td className="p-6 font-bold text-[#E50914]">{txn.tongTien?.toLocaleString('vi-VN')}đ</td>
                        <td className="p-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold w-fit inline-block ${
                            txn.trangThai === 'THANH_CONG' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                            txn.trangThai === 'THAT_BAI' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                            'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                          }`}>
                            {txn.trangThai === 'THANH_CONG' ? 'Thành công' : txn.trangThai === 'THAT_BAI' ? 'Đã hủy' : 'Đang xử lý'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {pagination.totalPages > 1 && (
                <div className="px-6 pb-4">
                  <Pagination currentPage={currentPage} totalPages={pagination.totalPages} onPageChange={handlePageChange} />
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default AdminBookingsPage;