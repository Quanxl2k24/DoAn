import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
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

    setSubmitting(true);
    try {
      // Lock seats
      await api.post('/ghes/giu', {
        suatChieuId,
        gheIds: selectedSeats,
      });

      const selectedGhes = seatData?.ghes?.filter((g) => selectedSeats.includes(g.id)) || [];
      const total = selectedGhes.reduce(
        (sum, g) => sum + (seatData?.suatChieu ? 120000 : 0) + (g.phuPhi || 0),
        0
      );

      navigate(
        `/payment?suatChieuId=${suatChieuId}&gheIds=${selectedSeats.join(',')}&total=${total}`
      );
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi giữ ghế');
    } finally {
      setSubmitting(false);
    }
  };

  // Group seats by row
  const groupedByRow = seatData?.ghes?.reduce((acc, ghe) => {
    if (!acc[ghe.hang]) acc[ghe.hang] = [];
    acc[ghe.hang].push(ghe);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="bg-surface min-h-screen flex items-center justify-center">
        <div className="text-on-surface text-xl">Đang tải sơ đồ ghế...</div>
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
          <div className="flex items-center gap-4 text-xs font-bold font-body">
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-white/10 border border-white/5"></div> Thường</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded border border-[#E50914] bg-[#E50914]/20 flex items-center justify-center"><span className="material-symbols-outlined text-[10px] text-[#E50914]">star</span></div> VIP</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-[#E50914] shadow-[0_0_8px_#E50914]"></div> Đang chọn</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-surface-container-lowest opacity-40"></div> Đã bán</div>
          </div>
        </div>

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
                      const isBeingHeld = ghe.trangThai === 'DANG_GIU';
                      const isSelected = selectedSeats.includes(ghe.id);
                      const isVip = ghe.loaiGhe === 'VIP';
                      const isDisabled = isOccupied || isBeingHeld;

                      return (
                        <button
                          key={ghe.id}
                          onClick={() => toggleSeat(ghe.id, ghe.trangThai)}
                          disabled={isDisabled}
                          className={`w-8 h-8 rounded-sm text-[10px] font-bold transition-all flex items-center justify-center ${
                            isOccupied
                              ? 'bg-surface-container-lowest opacity-40 cursor-not-allowed'
                              : isBeingHeld
                                ? 'bg-yellow-900/30 opacity-60 cursor-not-allowed border border-yellow-700/30'
                                : isSelected
                                  ? 'bg-[#E50914] text-white shadow-[0_0_10px_rgba(229,9,20,0.6)] border border-[#E50914]'
                                  : isVip
                                    ? 'bg-[#E50914]/10 border border-[#E50914]/50 hover:bg-[#E50914]/30 text-[#E50914]'
                                    : 'bg-white/10 border border-white/5 hover:bg-white/20 text-transparent hover:text-white/50'
                          }`}
                          title={`${ghe.tenGhe} - ${ghe.loaiGhe}`}
                        >
                          {isSelected ? ghe.tenGhe : (isVip && !isDisabled ? <span className="material-symbols-outlined text-[14px]">star</span> : '')}
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
          </div>
          <div className="flex items-center gap-6 w-full md:w-auto">
            <div className="flex flex-col text-right">
              <span className="text-secondary text-sm">Tạm tính</span>
              <span className="font-black text-2xl text-[#E50914]">
                {selectedSeats
                  .reduce((sum, id) => {
                    const ghe = seatData.ghes.find((g) => g.id === id);
                    return sum + 120000 + (ghe?.phuPhi || 0);
                  }, 0)
                  .toLocaleString('vi-VN')}{' '}
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
              {submitting ? 'Đang xử lý...' : 'TIẾP TỤC'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelectionPage;