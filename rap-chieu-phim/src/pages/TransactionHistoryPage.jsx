import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const TransactionHistoryPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const fetchHistory = async () => {
      try {
        const res = await api.get('/dat-ve/lich-su');
        setTransactions(res.data.data || []);
      } catch (error) {
        toast.error('Lỗi tải lịch sử giao dịch');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user, navigate]);

  return (
    <>
      <Header />
      <main className="pt-28 pb-24 min-h-screen bg-surface">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="mb-12">
            <h2 className="font-headline text-4xl font-bold tracking-tight mb-2 text-on-surface">
              LỊCH SỬ GIAO DỊCH
            </h2>
            <p className="text-secondary opacity-70">Quản lý vé xem phim và các giao dịch của bạn</p>
          </div>

          {loading ? (
            <div className="text-center text-secondary py-20">Đang tải...</div>
          ) : transactions.length === 0 ? (
            <div className="text-center text-secondary py-20">Chưa có giao dịch nào</div>
          ) : (
            <div className="flex flex-col gap-6">
              {transactions.map((txn) => {
                const veDauTien = txn.ves?.[0];
                const phim = veDauTien?.suatChieu?.phim;
                const rap = veDauTien?.suatChieu?.phong?.rap;
                const ghes = txn.ves?.map((v) => v.ghe?.tenGhe).join(', ');
                const thoiGian = new Date(txn.thoiGian);

                return (
                  <div
                    key={txn.id}
                    className="bg-surface-container-low border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:bg-surface-container-high transition-colors"
                  >
                    <div className="flex gap-6 items-start">
                      <div className="w-16 h-16 rounded-xl bg-surface-container-highest flex flex-col items-center justify-center text-on-surface border border-white/10 shrink-0">
                        <span className="text-xs font-bold text-secondary uppercase">
                          {thoiGian.toLocaleDateString('vi-VN', { month: '2-digit' })}
                        </span>
                        <span className="text-xl font-black">
                          {thoiGian.toLocaleDateString('vi-VN', { day: '2-digit' })}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-headline text-xl font-bold mb-1">{phim?.tenPhim || 'Phim'}</h3>
                        <p className="text-sm text-secondary mb-3">
                          {rap?.tenRap || 'Rạp'} • {thoiGian.toLocaleDateString('vi-VN')} •{' '}
                          {thoiGian.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <div className="flex flex-wrap gap-2 text-xs font-bold">
                          <span className="bg-surface-container-highest px-3 py-1 rounded-md text-on-surface">
                            Ghế: {ghes}
                          </span>
                          <span className="bg-surface-container-highest px-3 py-1 rounded-md text-on-surface">
                            Mã GD: {txn.id.slice(0, 8)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col md:items-end gap-3 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t border-white/5 md:border-t-0">
                      <div className="text-2xl font-black text-on-surface">
                        {txn.tongTien.toLocaleString('vi-VN')}đ
                      </div>
                      <div
                        className={`text-sm font-bold flex items-center gap-1 ${
                          txn.trangThai === 'THANH_CONG' ? 'text-tertiary' : 'text-[#E50914]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {txn.trangThai === 'THANH_CONG' ? 'check_circle' : 'cancel'}
                        </span>
                        {txn.trangThai === 'THANH_CONG' ? 'Đã hoàn tất' : 'Đã hủy'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default TransactionHistoryPage;