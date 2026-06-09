import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Skeleton from '../components/Skeleton';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const SeatSelectionPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const suatChieuId = searchParams.get('suatChieuId');

  const [seatData, setSeatData] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [heldSeats, setHeldSeats] = useState(null);
  const [holdUntil, setHoldUntil] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!suatChieuId) return;
    const fetchSeats = async () => {
      try {
        const res = await api.get(`/ghes/trang-thai/${suatChieuId}`);
        setSeatData(res.data.data);
      } catch (error) {
        toast.error('Lỗi tải sơ đồ ghế');
      } finally {
        setLoading(false);
      }
    };
    fetchSeats();
  }, [suatChieuId]);

  // Check held seats on mount (when coming back from payment)
  useEffect(() => {
    if (!suatChieuId || !user) return;
    const checkHeldSeats = async () => {
      try {
        const res = await api.get(`/ghes/giu/${suatChieuId}`);
        if (res.data.data) {
          const { gheIds, hetHanLuc } = res.data.data;
          setHeldSeats(gheIds);
          setSelectedSeats(gheIds);
          setHoldUntil(new Date(hetHanLuc).getTime());
        }
      } catch {
        // No held seats
      }
    };
    checkHeldSeats();
  }, [suatChieuId, user]);

  // Countdown timer for held seats
  useEffect(() => {
    if (!holdUntil) return;
    const tick = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((holdUntil - now) / 1000));
      setTimeLeft(diff);
      if (diff <= 0) {
        setHoldUntil(null);
        setHeldSeats(null);
        setTimeLeft(0);
      }
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [holdUntil]);

  const toggleSeat = (seatId, status) => {
    if (status !== 'TRONG') return;

    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId]
    );
  };

  const handleContinue = async () => {
    if (selectedSeats.length === 0) return;

    if (!user) {
      toast.error('Vui lòng đăng nhập để đặt vé');
      navigate('/login');
      return;
    }

    // If seats are already held, go straight to payment
    if (heldSeats) {
      navigateToPayment(selectedSeats, holdUntil);
      return;
    }

    setSubmitting(true);
    try {
      // Lock seats
      const res = await api.post('/ghes/giu', {
        suatChieuId,
        gheIds: selectedSeats,
      });

      const holdUntilTime = res.data.hetHanLuc;

      navigateToPayment(selectedSeats, new Date(holdUntilTime).getTime());
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi giữ ghế');
    } finally {
      setSubmitting(false);
    }
  };

  const navigateToPayment = (gheIds, holdUntilTime) => {
    const basePrice = seatData?.suatChieu?.giaSuatChieu || seatData?.phim?.giaCoBan || 120000;
    const selectedGhes = seatData?.ghes?.filter((g) => gheIds.includes(g.id)) || [];
    const total = selectedGhes.reduce(
      (sum, g) => sum + basePrice + (g.phuPhi || 0),
      0
    );
    navigate(
      `/payment?suatChieuId=${suatChieuId}&gheIds=${gheIds.join(',')}&total=${total}&holdUntil=${holdUntilTime}`
    );
  };

  const handleCancelSeats = async () => {
    try {
      await api.post('/ghes/huy-giu', { suatChieuId });
      setHeldSeats(null);
      setHoldUntil(null);
      setSelectedSeats([]);
      // Refresh seat data to update status from DANG_GIU → TRONG
      const res = await api.get(`/ghes/trang-thai/${suatChieuId}`);
      setSeatData(res.data.data);
      toast.success('Đã hủy giữ ghế');
    } catch (err) {
      toast.error('Lỗi hủy giữ ghế');
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Group seats by row
  const groupedByRow = seatData?.ghes?.reduce((acc, ghe) => {
    if (!acc[ghe.hang]) acc[ghe.hang] = [];
    acc[ghe.hang].push(ghe);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="bg-surface min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6">
          <Skeleton variant="rectangular" className="w-full max-w-[600px] h-12 rounded-lg" />
          <Skeleton variant="rectangular" className="w-full max-w-[600px] h-[400px] rounded-2xl" />
          <div className="flex gap-4">
            {[1,2,3,4,5].map(i => <Skeleton key={i} variant="circular" className="w-8 h-8" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!seatData) {
    return (
      <div className="bg-surface min-h-screen flex items-center justify-center">
        <div className="text-on-surface text-xl">Không tìm thấy dữ liệu</div>
      </div>
    );
  }

  return (
    <div className="bg-surface min-h-screen flex flex-col">
      <Header />

      <main className="pt-24 flex-1 flex flex-col pb-32">
        {/* Info Header */}
        <div className="px-6 py-4 bg-surface-container-low border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="font-headline text-2xl font-bold text-on-surface">{seatData.suatChieu?.id ? 'Chọn ghế' : ''}</h2>
            <p className="text-secondary text-sm">
              {seatData.phong?.tenPhong || ''} • {new Date(seatData.suatChieu?.thoiGianBatDau).toLocaleString('vi-VN')}
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold font-body flex-wrap">
            {[...new Set(seatData.ghes.map(g => g.loaiGhe))].map(loai => {
              const ghe = seatData.ghes.find(g => g.loaiGhe === loai);
              const phuPhi = ghe?.phuPhi || 0;
              const isVip = loai === 'VIP';
              const isSweetbox = loai === 'SWEETBOX';
              return (
                <div key={loai} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded ${isVip ? 'border border-[#E50914] bg-[#E50914]/20 flex items-center justify-center' : isSweetbox ? 'border border-pink-500 bg-pink-500/20 flex items-center justify-center' : 'bg-white/10 border border-white/5'}`}>
                    {(isVip || isSweetbox) && <span className={`material-symbols-outlined text-[10px] ${isVip ? 'text-[#E50914]' : 'text-pink-500'}`}>{isVip ? 'star' : 'favorite'}</span>}
                  </div>
                  <span>{loai === 'SWEETBOX' ? 'Đôi' : loai.charAt(0) + loai.slice(1).toLowerCase()}</span>
                  {phuPhi > 0 && <span className="text-[#E50914]">+{phuPhi.toLocaleString('vi-VN')}đ</span>}
                </div>
              );
            })}
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-[#E50914] shadow-[0_0_8px_#E50914]"></div> Đang chọn</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-surface-container-lowest opacity-40"></div> Đã bán</div>
          </div>
        </div>

        {/* Held Seats Banner */}
        {heldSeats && holdUntil && timeLeft > 0 && (
          <div className="mx-6 mt-4 bg-surface-container-low rounded-2xl border border-[#E50914]/30 p-5 flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center gap-3 flex-1">
              <span className="material-symbols-outlined text-[#E50914] text-3xl">timer</span>
              <div>
                <p className="font-bold text-on-surface text-sm">Bạn đang giữ ghế</p>
                <p className="text-secondary text-xs">
                  {heldSeats.map((id) => seatData?.ghes?.find((g) => g.id === id)?.tenGhe).join(', ')}
                </p>
              </div>
            </div>
            <div className={`text-2xl font-black font-mono ${timeLeft < 60 ? 'text-[#E50914] animate-pulse' : 'text-on-surface'}`}>
              {formatTime(timeLeft)}
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <button
                onClick={() => navigateToPayment(selectedSeats, holdUntil)}
                className="flex-1 md:flex-none bg-[#E50914] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-red-700 transition-colors"
              >
                Tiếp tục thanh toán
              </button>
              <button
                onClick={handleCancelSeats}
                className="flex-1 md:flex-none bg-white/10 text-on-surface px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-white/20 transition-colors border border-white/10"
              >
                Bỏ ghế đã chọn
              </button>
            </div>
          </div>
        )}

        {/* Screen */}
        <div className="mt-12 mb-16 px-6 max-w-[800px] mx-auto w-full">
          <div className="relative h-12 flex justify-center">
            <div className="absolute w-full h-full border-t-[4px] border-[#E50914] rounded-[50%] blur-[2px] opacity-70" style={{ transform: 'rotateX(60deg)' }}></div>
            <div className="absolute w-full h-full bg-gradient-to-b from-[#E50914]/20 to-transparent blur-md" style={{ transform: 'rotateX(60deg)' }}></div>
            <span className="absolute -top-6 text-xs font-bold text-secondary tracking-[0.3em] uppercase">Màn hình</span>
          </div>
        </div>

        {/* Seat Grid */}
        <div className="overflow-x-auto px-6 pb-10 hide-scrollbar flex-1">
          <div className="min-w-[600px] max-w-[800px] mx-auto flex flex-col gap-3">
            {groupedByRow &&
              Object.entries(groupedByRow).map(([hang, ghes]) => (
                <div key={hang} className="flex items-center justify-center gap-3">
                  <div className="w-6 text-center text-sm font-bold text-secondary mr-2">{hang}</div>

                  <div className="flex gap-2">
                    {ghes.map((ghe) => {
                      const isOccupied = ghe.trangThai === 'DA_BAN';
                      const isHeldByMe = heldSeats?.includes(ghe.id);
                      const isBeingHeld = ghe.trangThai === 'DANG_GIU' && !isHeldByMe;
                      const isSelected = selectedSeats.includes(ghe.id);
                      const isVip = ghe.loaiGhe === 'VIP';
                      const isDisabled = isOccupied || isBeingHeld;

                      const isSweetbox = ghe.loaiGhe === 'SWEETBOX';

                      return (
                        <button
                          key={ghe.id}
                          onClick={() => toggleSeat(ghe.id, ghe.trangThai)}
                          disabled={isDisabled}
                          className={`w-8 h-8 rounded-sm text-[10px] font-bold transition-all flex items-center justify-center relative group ${
                            isOccupied
                              ? 'bg-surface-container-lowest opacity-40 cursor-not-allowed'
                              : isBeingHeld
                                ? 'bg-yellow-900/30 opacity-60 cursor-not-allowed border border-yellow-700/30'
                                : isSelected
                                  ? 'bg-[#E50914] text-white shadow-[0_0_10px_rgba(229,9,20,0.6)] border border-[#E50914]'
                                  : isVip
                                    ? 'bg-[#E50914]/10 border border-[#E50914]/50 hover:bg-[#E50914]/30 text-[#E50914]'
                                    : isSweetbox
                                      ? 'bg-pink-500/10 border border-pink-500/50 hover:bg-pink-500/30 text-pink-500'
                                      : 'bg-white/10 border border-white/5 hover:bg-white/20 text-transparent hover:text-white/50'
                          }`}
                          title={`${ghe.tenGhe} - ${ghe.loaiGhe}${ghe.phuPhi > 0 ? ` (+${ghe.phuPhi.toLocaleString('vi-VN')}đ)` : ''}`}
                        >
                          {isSelected ? ghe.tenGhe : (
                            isVip && !isDisabled ? <span className="material-symbols-outlined text-[14px]">star</span> :
                            isSweetbox && !isDisabled ? <span className="material-symbols-outlined text-[14px]">favorite</span> :
                            ''
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="w-6 text-center text-sm font-bold text-secondary ml-2">{hang}</div>
                </div>
              ))}
          </div>
        </div>
      </main>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-surface-container-high/90 backdrop-blur-xl border-t border-white/5 p-6 z-50">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col">
            <span className="text-secondary text-sm">Ghế đã chọn</span>
            <span className="font-bold text-lg text-on-surface">
              {selectedSeats.length > 0
                ? selectedSeats.map((id) => seatData.ghes.find((g) => g.id === id)?.tenGhe).join(', ')
                : 'Chưa chọn ghế'}
            </span>
            {selectedSeats.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-1">
                {[...new Set(selectedSeats.map((id) => {
                  const g = seatData.ghes.find((g) => g.id === id);
                  return g?.loaiGhe;
                }))].map(loai => {
                  const count = selectedSeats.filter((id) => {
                    const g = seatData.ghes.find((g) => g.id === id);
                    return g?.loaiGhe === loai;
                  }).length;
                  const ghe = seatData.ghes.find((g) => g.loaiGhe === loai);
                  const phuPhi = ghe?.phuPhi || 0;
                  return (
                    <span key={loai} className="text-[10px] text-secondary bg-white/5 px-2 py-0.5 rounded-full">
                      {count} {loai === 'SWEETBOX' ? 'đôi' : loai.toLowerCase()}
                      {phuPhi > 0 && <span className="text-[#E50914]"> (+{phuPhi.toLocaleString('vi-VN')}đ)</span>}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
          <div className="flex items-center gap-6 w-full md:w-auto">
            <div className="flex flex-col text-right">
              <span className="text-secondary text-sm">Tạm tính</span>
              <span className="font-black text-2xl text-[#E50914]">
                {(selectedSeats
                  .reduce((sum, id) => {
                    const basePrice = seatData?.suatChieu?.giaSuatChieu || seatData?.phim?.giaCoBan || 120000;
                    const ghe = seatData.ghes.find((g) => g.id === id);
                    return sum + basePrice + (ghe?.phuPhi || 0);
                  }, 0)
                ).toLocaleString('vi-VN')}{' '}
                đ
              </span>
            </div>
            <button
              onClick={handleContinue}
              disabled={selectedSeats.length === 0 || submitting}
              className={`px-8 py-4 rounded-xl font-bold text-lg transition-all flex-1 md:flex-none text-center ${
                selectedSeats.length > 0
                  ? 'bg-[#E50914] text-white hover:bg-red-700 shadow-lg shadow-red-900/30'
                  : 'bg-surface-container-low text-secondary cursor-not-allowed'
              }`}
            >
              {submitting ? 'Đang xử lý...' : heldSeats ? 'TIẾP TỤC THANH TOÁN' : 'TIẾP TỤC'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelectionPage;