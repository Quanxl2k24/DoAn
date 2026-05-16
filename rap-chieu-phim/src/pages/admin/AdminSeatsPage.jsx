import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const AdminSeatsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const phongId = searchParams.get('phongId');
  
  const [phong, setPhong] = useState(null);
  const [seats, setSeats] = useState([]);
  const [loaiGhes, setLoaiGhes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);
  const [selectedTool, setSelectedTool] = useState('select'); // select, type, status

  useEffect(() => {
    if (!phongId) {
      toast.error('Thiếu mã phòng chiếu');
      navigate('/admin/rooms');
      return;
    }
    fetchData();
  }, [phongId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [phongRes, seatsRes] = await Promise.all([
        api.get(`/phongs/${phongId}`),
        api.get(`/ghes/phong/${phongId}`)
      ]);
      setPhong(phongRes.data.data);
      setSeats(seatsRes.data.data.ghes || []);
      setLoaiGhes(seatsRes.data.data.loaiGhes || []);
    } catch (err) {
      toast.error('Lỗi tải dữ liệu sơ đồ ghế');
    } finally {
      setLoading(false);
    }
  };

  const toggleSeatSelection = (id) => {
    setSelectedSeatIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleApplyTool = async (type, value) => {
    if (selectedSeatIds.length === 0) {
      toast.error('Vui lòng chọn ít nhất một ghế');
      return;
    }

    try {
      const payload = {
        gheIds: selectedSeatIds,
        [type]: value
      };
      await api.put('/ghes/update-many', payload);
      toast.success('Cập nhật thành công');
      setSelectedSeatIds([]);
      fetchData();
    } catch (err) {
      toast.error('Lỗi cập nhật ghế');
    }
  };

  const selectAll = () => setSelectedSeatIds(seats.map(s => s.id));
  const deselectAll = () => setSelectedSeatIds([]);

  if (loading) return (
    <div className="flex bg-[#131313] min-h-screen">
      <Sidebar />
      <div className="flex-1 flex items-center justify-center text-white">Đang tải...</div>
    </div>
  );

  // Group seats by row
  const rows = [...new Set(seats.map(s => s.hang))].sort();
  const maxCols = Math.max(...seats.map(s => s.cot), 0);

  return (
    <>
      <Sidebar />
      <main className="ml-64 p-12 min-h-screen bg-[#131313] flex flex-col">
        <AdminHeader title="SƠ ĐỒ GHẾ" subtitle={`Phòng: ${phong?.tenPhong} - ${phong?.rap?.tenRap}`} />

        <div className="mb-8 flex justify-between items-end">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-headline text-3xl font-bold text-white">Thiết lập sơ đồ ghế</h1>
              <span className="bg-[#E50914] px-3 py-1 rounded-full text-xs font-bold text-white tracking-wider">
                {phong?.tenPhong}
              </span>
            </div>
            <p className="text-gray-400">Chọn ghế trên sơ đồ để thay đổi loại ghế hoặc trạng thái</p>
          </div>
          <div className="flex gap-3">
            <button onClick={selectAll} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-bold transition-all">Chọn tất cả</button>
            <button onClick={deselectAll} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-bold transition-all">Bỏ chọn</button>
          </div>
        </div>

        <div className="flex gap-8 flex-1 min-h-0">
          {/* Main Seat Map Area */}
          <div className="flex-1 bg-[#1C1B1B] rounded-2xl border border-white/5 overflow-hidden flex flex-col p-8 shadow-2xl relative">
            {/* Screen indicator */}
            <div className="w-full max-w-[600px] mx-auto mb-20 relative">
              <div className="h-2 w-full bg-gradient-to-r from-transparent via-[#E50914] to-transparent rounded-[50%] blur-[2px] opacity-70"></div>
              <div className="h-12 w-full bg-gradient-to-b from-[#E50914]/10 to-transparent blur-xl"></div>
              <div className="absolute -top-6 w-full text-center text-xs font-black text-white/30 uppercase tracking-[0.5em]">Màn hình chiếu</div>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-auto hide-scrollbar flex items-center justify-center p-4">
              <div className="flex flex-col gap-4">
                {rows.map((row) => (
                  <div key={row} className="flex items-center justify-center gap-4">
                    <div className="w-8 text-center font-black text-white/20 text-sm">{row}</div>
                    <div className="flex gap-2">
                      {seats.filter(s => s.hang === row).sort((a, b) => a.cot - b.cot).map((seat) => {
                        const isSelected = selectedSeatIds.includes(seat.id);
                        const typeColor = seat.loaiGhe.tenLoai === 'VIP' ? 'border-amber-500/50 text-amber-500' 
                                        : seat.loaiGhe.tenLoai === 'SWEETBOX' ? 'border-pink-500/50 text-pink-500'
                                        : 'border-white/20 text-white/40';
                        
                        const statusColor = seat.trangThai === 'BAO_TRI' ? 'bg-neutral-800 border-red-900/50 text-red-900' : 'bg-white/5';

                        return (
                          <button
                            key={seat.id}
                            onClick={() => toggleSeatSelection(seat.id)}
                            className={`w-9 h-9 rounded-lg border text-[10px] font-black flex items-center justify-center transition-all duration-200 hover:scale-110 
                              ${isSelected ? 'bg-[#E50914] border-[#E50914] text-white shadow-[0_0_15px_rgba(229,9,20,0.4)] z-10' : `${statusColor} ${typeColor}`}
                            `}
                            title={`${seat.tenGhe} (${seat.loaiGhe.tenLoai})`}
                          >
                            {seat.trangThai === 'BAO_TRI' ? (
                              <span className="material-symbols-outlined text-[16px]">block</span>
                            ) : (
                              <span>{seat.cot}</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    <div className="w-8 text-center font-black text-white/20 text-sm">{row}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Toolbar */}
          <div className="w-80 flex flex-col gap-6">
            <div className="bg-[#1C1B1B] rounded-2xl border border-white/5 p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-[#E50914]">edit_attributes</span>
                <h3 className="font-headline font-bold text-lg text-white uppercase tracking-wider">Công cụ chỉnh sửa</h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-widest">Loại ghế</p>
                  <div className="grid grid-cols-1 gap-2">
                    {loaiGhes.map(type => (
                      <button 
                        key={type.id}
                        onClick={() => handleApplyTool('loaiGheId', type.id)}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/10 transition-all text-sm group"
                      >
                        <span className="text-gray-300 font-medium">{type.tenLoai}</span>
                        <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-gray-400 group-hover:text-white transition-colors">ÁP DỤNG</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-widest">Trạng thái</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => handleApplyTool('trangThai', 'HOAT_DONG')}
                      className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-bold hover:bg-green-500/20 transition-all"
                    >
                      HOẠT ĐỘNG
                    </button>
                    <button 
                      onClick={() => handleApplyTool('trangThai', 'BAO_TRI')}
                      className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold hover:bg-red-500/20 transition-all"
                    >
                      BẢO TRÌ
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="text-gray-500">Đang chọn:</span>
                  <span className="font-black text-[#E50914] text-sm">{selectedSeatIds.length} ghế</span>
                </div>
                <p className="text-[10px] text-gray-500 italic leading-relaxed">
                  * Chọn các ghế trên sơ đồ, sau đó nhấn "ÁP DỤNG" ở loại ghế hoặc trạng thái mong muốn.
                </p>
              </div>
            </div>

            <div className="bg-[#1C1B1B] rounded-2xl border border-white/5 p-6 shadow-xl flex-1">
              <h3 className="font-headline font-bold text-sm text-gray-500 uppercase mb-4 tracking-widest">Chú giải</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded bg-white/5 border border-white/20"></div>
                  <span className="text-xs text-gray-400">Ghế thường</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded bg-white/5 border border-amber-500/50"></div>
                  <span className="text-xs text-gray-400">Ghế VIP</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded bg-white/5 border border-pink-500/50"></div>
                  <span className="text-xs text-gray-400">Ghế đôi (Sweetbox)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded bg-neutral-800 border border-red-900/50 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[12px] text-red-900">block</span>
                  </div>
                  <span className="text-xs text-gray-400">Đang bảo trì / Hỏng</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default AdminSeatsPage;
