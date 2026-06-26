import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { tinhGiaVe, tinhPhuPhiTheoGio, tinhPhuPhiTheoNgay, tinhPhuPhiNgayLe } from '../utils/pricing';

const PaymentPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const suatChieuId = searchParams.get('suatChieuId');
  const gheIds = searchParams.get('gheIds')?.split(',') || [];
  const total = Number(searchParams.get('total')) || 0;
  const initialHoldUntil = searchParams.get('holdUntil');

  const [paymentMethod, setPaymentMethod] = useState('MOMO');
  const [submitting, setSubmitting] = useState(false);
  const [bookingInfo, setBookingInfo] = useState(null);
  const [holdUntil, setHoldUntil] = useState(initialHoldUntil ? Number(initialHoldUntil) : null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [expired, setExpired] = useState(false);
  const [reholding, setRekolding] = useState(false);
  const submittingRef = useRef(false);

  useEffect(() => {
    if (!suatChieuId || gheIds.length === 0) return;
    const fetchInfo = async () => {
      try {
        const res = await api.get(`/ghes/trang-thai/${suatChieuId}`);
        const data = res.data.data;
        const selectedGhes = data.ghes.filter((g) => gheIds.includes(g.id));
        setBookingInfo({
          phim: data.phim,
          suatChieu: data.suatChieu,
          phong: data.phong,
          ghes: selectedGhes,
          ngayLes: data.danhSachNgayLe,
        });
      } catch (err) {
        console.error('Lỗi tải thông tin thanh toán:', err);
      }
    };
    fetchInfo();
  }, [suatChieuId, gheIds]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const checkHoldStatus = useCallback(async () => {
    if (!suatChieuId || !user) return;
    try {
      const res = await api.get(`/ghes/giu/${suatChieuId}`);
      if (res.data.data) {
        setHoldUntil(new Date(res.data.data.hetHanLuc).getTime());
        setExpired(false);
      } else {
        setHoldUntil(null);
        setTimeLeft(0);
        setExpired(true);
      }
    } catch {
      setExpired(true);
    }
  }, [suatChieuId, user]);

  // Sync hold status from server on mount
  useEffect(() => {
    checkHoldStatus();
  }, [checkHoldStatus]);

  // Countdown timer
  useEffect(() => {
    if (!holdUntil) return;

    const tick = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((holdUntil - now) / 1000));
      setTimeLeft(diff);
      if (diff <= 0) {
        setExpired(true);
        setHoldUntil(null);
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [holdUntil]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleRehold = async () => {
    setRekolding(true);
    try {
      const res = await api.post('/ghes/giu', { suatChieuId, gheIds });
      setHoldUntil(new Date(res.data.hetHanLuc).getTime());
      setExpired(false);
      toast.success('Đã giữ ghế lại thành công');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể giữ ghế');
    } finally {
      setRekolding(false);
    }
  };

  const handlePayment = async () => {
    if (!suatChieuId || gheIds.length === 0) {
      toast.error('Thiếu thông tin đặt vé');
      return;
    }

    if (expired) {
      toast.error('Phiên giữ ghế đã hết hạn. Vui lòng giữ ghế lại trước khi thanh toán.');
      return;
    }

    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    try {
      await api.post('/dat-ve', {
        suatChieuId,
        gheIds,
        phuongThuc: paymentMethod,
      });
      toast.success('Đặt vé thành công!');
      navigate('/history');
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data?.error || '';
      toast.error(message || 'Thanh toán thất bại');
      if (message.includes('hết hạn') || message.includes('đã được đặt')) {
        setExpired(true);
        setHoldUntil(null);
        setTimeLeft(0);
      }
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  const paymentMethods = [
    { id: 'MOMO', name: 'Ví MoMo', icon: 'account_balance_wallet' },
    { id: 'ZALOPAY', name: 'ZaloPay', icon: 'account_balance_wallet' },
    { id: 'CARD', name: 'Thẻ tín dụng / Ghi nợ', icon: 'credit_card' },
    { id: 'ATM', name: 'Thẻ ATM nội địa', icon: 'payments' },
  ];

  return (
    <>
      <Header />
      <main className="pt-28 pb-24 min-h-screen bg-surface">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            {/* Countdown Timer */}
            {holdUntil && !expired && (
              <div className="bg-surface-container-low rounded-2xl border border-white/5 p-6 flex items-center gap-4">
                <span className="material-symbols-outlined text-[#E50914] text-3xl">timer</span>
                <div className="flex-1">
                  <p className="text-sm text-secondary">Giữ ghế</p>
                  <p className="text-xs text-gray-500">Hoàn tất thanh toán trước khi hết thời gian giữ ghế</p>
                </div>
                <div className={`text-3xl font-black font-mono ${timeLeft < 60 ? 'text-[#E50914] animate-pulse' : 'text-on-surface'}`}>
                  {formatTime(timeLeft)}
                </div>
              </div>
            )}

            {expired && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex items-center gap-4">
                <span className="material-symbols-outlined text-red-500 text-3xl">timer_off</span>
                <div className="flex-1">
                  <p className="text-sm font-bold text-red-500">Phiên giữ ghế đã hết hạn</p>
                  <p className="text-xs text-gray-400">Các ghế bạn chọn đã được nhả ra. Hãy giữ lại để tiếp tục thanh toán.</p>
                </div>
                <button
                  onClick={handleRehold}
                  disabled={reholding}
                  className="bg-[#E50914] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {reholding ? 'Đang giữ...' : 'Giữ lại'}
                </button>
              </div>
            )}

            <section>
              <h3 className="font-headline text-2xl font-bold tracking-tight mb-6 text-on-surface">
                PHƯƠNG THỨC THANH TOÁN
              </h3>
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center gap-4 p-5 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === method.id
                        ? 'bg-surface-container-high border-[#E50914]'
                        : 'bg-surface-container-low border-white/5 hover:bg-surface-container-high'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                      className="hidden"
                    />
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === method.id ? 'border-[#E50914]' : 'border-secondary'
                      }`}
                    >
                      {paymentMethod === method.id && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#E50914]"></div>
                      )}
                    </div>
                    <span className="material-symbols-outlined text-secondary">{method.icon}</span>
                    <span className="font-bold text-on-surface">{method.name}</span>
                  </label>
                ))}
              </div>
            </section>
          </div>

          <div>
            <div className="bg-surface-container-low rounded-3xl p-8 border border-white/5 sticky top-28">
              <h3 className="font-headline text-xl font-bold mb-6 text-on-surface border-b border-white/5 pb-4">
                TÓM TẮT ĐƠN HÀNG
              </h3>

              {bookingInfo && (
                <div className="space-y-4 text-sm mb-6 border-b border-white/5 pb-6">
                  <div className="flex justify-between">
                    <span className="text-secondary">Phim</span>
                    <span className="font-bold text-on-surface text-right">{bookingInfo.phim?.tenPhim}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary">Suất</span>
                    <span className="font-bold text-on-surface">
                      {new Date(bookingInfo.suatChieu?.thoiGianBatDau).toLocaleTimeString('vi-VN', {
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary">Ghế</span>
                    <span className="font-bold text-on-surface text-right">
                      {bookingInfo.ghes.map((g) => g.tenGhe).join(', ')}
                    </span>
                  </div>
                  <div className="border-t border-white/5 pt-3">
                    <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-3">Chi tiết giá</p>
                    {(() => {
                      const giaCoBan = bookingInfo.suatChieu?.giaSuatChieu || bookingInfo.phim?.giaCoBan || 0;
                      const ngayChieu = new Date(bookingInfo.suatChieu?.thoiGianBatDau);
                      const gioBatDau = ngayChieu.getHours();
                      const dsNgayLe = bookingInfo.ngayLes || [];
                      const apDungCuoiTuan = bookingInfo.suatChieu?.apDungPhuPhiCuoiTuan ?? true;
                      const apDungNgayLe = bookingInfo.suatChieu?.apDungPhuPhiNgayLe ?? true;
                      const apDungTheoGio = bookingInfo.suatChieu?.apDungPhuPhiTheoGio ?? true;
                      const phuPhiTime = apDungTheoGio ? tinhPhuPhiTheoGio(gioBatDau) : 0;

                      // Find holiday name
                      const target = new Date(ngayChieu);
                      target.setHours(0, 0, 0, 0);
                      const holiday = dsNgayLe.find(h => {
                        const hd = new Date(h.ngay);
                        hd.setHours(0, 0, 0, 0);
                        return target.getTime() === hd.getTime();
                      });

                      const phuPhiNgay = apDungNgayLe && holiday
                        ? 25000
                        : apDungCuoiTuan
                          ? tinhPhuPhiTheoNgay(ngayChieu)
                          : 0;
                      const phuPhiNgayLabel = holiday ? holiday.tenNgayLe
                        : phuPhiNgay > 0 ? 'Cuối tuần'
                        : '';
                      return (
                        <>
                          <div className="flex justify-between items-center py-1">
                            <span className="text-secondary text-xs">Giá cơ bản</span>
                            <span className="font-bold text-on-surface text-xs">{giaCoBan.toLocaleString('vi-VN')}đ</span>
                          </div>
                          {phuPhiTime > 0 && (
                            <div className="flex justify-between items-center py-1">
                              <span className="text-secondary text-xs">Phụ phí giờ chiếu</span>
                              <span className="font-bold text-on-surface text-xs">+{phuPhiTime.toLocaleString('vi-VN')}đ</span>
                            </div>
                          )}
                          {phuPhiNgay > 0 && (
                            <div className="flex justify-between items-center py-1">
                              <span className="text-secondary text-xs">Phụ phí ngày chiếu ({phuPhiNgayLabel})</span>
                              <span className="font-bold text-on-surface text-xs">+{phuPhiNgay.toLocaleString('vi-VN')}đ</span>
                            </div>
                          )}
                          {bookingInfo.ghes.map((g) => (
                            <div key={g.id} className="flex justify-between items-center py-1">
                              <span className="text-secondary text-xs">
                                {g.tenGhe}
                                {g.phuPhi > 0 && (
                                  <span className="text-[#E50914] ml-1">({g.loaiGhe})</span>
                                )}
                              </span>
                              <span className="font-bold text-on-surface text-xs">
                                {tinhGiaVe(giaCoBan, g.loaiGhe, gioBatDau, ngayChieu, dsNgayLe, apDungCuoiTuan, apDungNgayLe, apDungTheoGio).toLocaleString('vi-VN')}đ
                              </span>
                            </div>
                          ))}
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}

              {!bookingInfo && (
                <div className="space-y-4 text-sm mb-6 border-b border-white/5 pb-6">
                  <li className="flex justify-between">
                    <span className="text-secondary">Ghế</span>
                    <span className="font-bold text-on-surface">{gheIds.length} ghế</span>
                  </li>
                </div>
              )}

              <div className="space-y-4 text-sm mb-8">
                <li className="flex justify-between items-center">
                  <span className="text-secondary">Tạm tính</span>
                  <span className="font-bold text-on-surface">{total.toLocaleString('vi-VN')}đ</span>
                </li>
                <li className="flex justify-between items-center pt-4 border-t border-white/5">
                  <span className="text-lg font-bold text-on-surface">Tổng cộng</span>
                  <span className="font-black text-3xl text-[#E50914]">
                    {total.toLocaleString('vi-VN')}đ
                  </span>
                </li>
              </div>

              <button
                onClick={handlePayment}
                disabled={submitting || expired}
                className={`w-full text-center font-bold py-4 rounded-xl transition-colors shadow-lg shadow-red-900/30 disabled:opacity-50 ${
                  expired
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-[#E50914] text-white hover:bg-red-700'
                }`}
              >
                {submitting ? 'ĐANG XỬ LÝ...' : expired ? 'HẾT HẠN - GIỮ LẠI' : 'THANH TOÁN'}
              </button>

              <p className="text-center text-[10px] text-secondary mt-4 px-4">
                Bằng việc bấm "Thanh toán", bạn đã đồng ý với các điều khoản sử dụng của Cine Première.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PaymentPage;