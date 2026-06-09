import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import { SkeletonTable } from '../../components/Skeleton';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const AdminSchedulesPage = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const location = useLocation();

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [phims, setPhims] = useState([]);
  const [raps, setRaps] = useState([]);
  const [phongs, setPhongs] = useState([]);
  const [selectedRap, setSelectedRap] = useState('');
  const [form, setForm] = useState({
    phimId: '',
    phongId: '',
    thoiGianBatDau: '',
    giaSuatChieu: ''
  });

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/suat-chieus?ngay=${selectedDate}`);
      setSchedules(res.data.data || []);
    } catch (error) {
      toast.error('Lỗi tải lịch chiếu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [selectedDate]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [phimRes, rapRes] = await Promise.all([
          api.get('/phims?limit=100'),
          api.get('/raps')
        ]);
        // Filter movies that are DANG_CHIEU or SAP_CHIEU
        const filteredPhims = (phimRes.data.data || []).filter(
          p => p.trangThai === 'DANG_CHIEU' || p.trangThai === 'SAP_CHIEU'
        );
        setPhims(filteredPhims);
        setRaps(rapRes.data.data || []);

        // Check for phimId in URL
        const params = new URLSearchParams(location.search);
        const phimIdFromUrl = params.get('phimId');
        if (phimIdFromUrl) {
          setShowForm(true);
          const movie = filteredPhims.find(p => p.id === phimIdFromUrl);
          setForm(prev => ({ 
            ...prev, 
            phimId: phimIdFromUrl,
            giaSuatChieu: movie ? movie.giaCoBan : ''
          }));
        }
      } catch (error) {
        toast.error('Lỗi tải danh sách phim và rạp');
      }
    };
    fetchInitialData();
  }, [location.search]);

  useEffect(() => {
    if (!selectedRap) {
      setPhongs([]);
      setForm(prev => ({ ...prev, phongId: '' }));
      return;
    }
    const fetchPhongs = async () => {
      try {
        const res = await api.get(`/phongs/rap/${selectedRap}`);
        setPhongs(res.data.data || []);
        if (res.data.data?.length > 0) {
          setForm(prev => ({ ...prev, phongId: res.data.data[0].id }));
        } else {
          setForm(prev => ({ ...prev, phongId: '' }));
        }
      } catch (error) {
        toast.error('Lỗi tải danh sách phòng chiếu');
      }
    };
    fetchPhongs();
  }, [selectedRap]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.phimId || !form.phongId || !form.thoiGianBatDau || !form.giaSuatChieu) {
      toast.error('Vui lòng điền đủ thông tin');
      return;
    }
    
    // Convert to ISO-8601 for Prisma
    const submitData = { ...form };
    submitData.thoiGianBatDau = new Date(submitData.thoiGianBatDau).toISOString();

    try {
      await api.post('/suat-chieus', submitData);
      toast.success('Thêm suất chiếu thành công');
      setShowForm(false);
      // Reset form
      setForm({ phimId: '', phongId: '', thoiGianBatDau: '', giaSuatChieu: '' });
      setSelectedRap('');
      fetchSchedules();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi thêm suất chiếu');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc chắn muốn xoá suất chiếu này?')) return;
    try {
      await api.delete(`/suat-chieus/${id}`);
      toast.success('Xoá suất chiếu thành công');
      fetchSchedules();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi xoá suất chiếu');
    }
  };

  const getStatus = (thoiGianBatDau, thoiGianKetThuc) => {
    const now = new Date();
    const start = new Date(thoiGianBatDau);
    const end = new Date(thoiGianKetThuc);
    if (now > end) return 'Đã chiếu';
    if (now >= start && now <= end) return 'Đang chiếu';
    return 'Sắp chiếu';
  };

  return (
    <>
      <Sidebar />
      <main className="ml-64 p-12 min-h-screen bg-surface">
        <AdminHeader title="LỊCH CHIẾU" subtitle="Quản lý suất chiếu" />

        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="font-headline text-3xl font-bold text-on-surface mb-2">Lịch chiếu</h1>
            <p className="text-secondary opacity-70">Quản lý và sắp xếp suất chiếu cho các phòng</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white flex items-center border border-neutral-300 rounded-lg px-4 py-2">
              <span className="material-symbols-outlined text-secondary mr-2 text-[20px]">calendar_today</span>
              <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-black outline-none text-sm font-bold" />
            </div>
            <button 
              onClick={() => setShowForm(!showForm)}
              className="bg-[#E50914] text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700 transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined">{showForm ? 'close' : 'add'}</span>
              {showForm ? 'ĐÓNG' : 'THÊM SUẤT CHIẾU'}
            </button>
          </div>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-surface-container-low p-6 rounded-2xl border border-white/5 mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1">Phim</label>
              <select 
                value={form.phimId} 
                onChange={(e) => {
                  const movie = phims.find(p => p.id === e.target.value);
                  setForm({ ...form, phimId: e.target.value, giaSuatChieu: movie ? movie.giaCoBan : '' });
                }}
                className="w-full bg-white text-black px-4 py-2 rounded-lg border border-white/5" 
                required
              >
                <option value="">Chọn phim</option>
                {phims.map(p => <option key={p.id} value={p.id}>{p.tenPhim}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Giá vé suất chiếu (VNĐ)</label>
              <input 
                type="number"
                value={form.giaSuatChieu} 
                onChange={(e) => setForm({ ...form, giaSuatChieu: e.target.value })}
                className="w-full bg-white text-black px-4 py-2 rounded-lg border border-white/5" 
                placeholder="Nhập giá vé..."
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Rạp Chiếu</label>
              <select 
                value={selectedRap} 
                onChange={(e) => setSelectedRap(e.target.value)}
                className="w-full bg-white text-black px-4 py-2 rounded-lg border border-white/5" required>
                <option value="">-- Chọn Rạp --</option>
                {raps.map(r => <option key={r.id} value={r.id}>{r.tenRap}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Phòng Chiếu</label>
              <select 
                value={form.phongId} 
                onChange={(e) => setForm({ ...form, phongId: e.target.value })}
                className="w-full bg-white text-black px-4 py-2 rounded-lg border border-white/5" 
                required
                disabled={!selectedRap || phongs.length === 0}>
                <option value="">-- Chọn Phòng --</option>
                {phongs.map(p => <option key={p.id} value={p.id}>{p.tenPhong}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Giờ Bắt Đầu</label>
              <input 
                type="datetime-local" 
                value={form.thoiGianBatDau} 
                onChange={(e) => setForm({ ...form, thoiGianBatDau: e.target.value })}
                className="w-full bg-white text-black px-4 py-2 rounded-lg border border-white/5" required />
            </div>
            <div className="lg:col-span-4 mt-2">
              <button type="submit" className="bg-[#E50914] text-white px-8 py-3 rounded-xl font-bold w-fit">
                LƯU SUẤT CHIẾU
              </button>
            </div>
          </form>
        )}

        {loading ? <div className="bg-surface-container-low rounded-2xl border border-white/5 overflow-hidden"><SkeletonTable rows={5} cols={7} /></div> : schedules.length === 0 ? (
          <div className="text-center py-20 text-secondary">Không có suất chiếu cho ngày này</div>
        ) : (
          <div className="bg-surface-container-low rounded-2xl border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 text-secondary text-sm border-b border-white/5">
                    <th className="p-6 font-medium">Suất chiếu</th>
                    <th className="p-6 font-medium">Phim</th>
                    <th className="p-6 font-medium">Phòng</th>
                    <th className="p-6 font-medium">Giá vé</th>
                    <th className="p-6 font-medium">Tỷ lệ lấp đầy</th>
                    <th className="p-6 font-medium">Trạng thái</th>
                    <th className="p-6 font-medium text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-on-surface">
                  {schedules.map((sc) => {
                    const status = getStatus(sc.thoiGianBatDau, sc.thoiGianKetThuc);
                    const fillPercentage = sc.soGheTrong !== undefined
                      ? Math.round(((sc.soGheDat || 0) / ((sc.soGheDat || 0) + sc.soGheTrong)) * 100)
                      : 0;

                    return (
                      <tr key={sc.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-6">
                          <div className="font-bold text-on-surface">
                            {new Date(sc.thoiGianBatDau).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                            {' - '}
                            {new Date(sc.thoiGianKetThuc).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="text-xs text-secondary mt-1">{new Date(sc.thoiGianBatDau).toLocaleDateString('vi-VN')}</div>
                        </td>
                        <td className="p-6">
                          <div className="font-bold max-w-[200px] truncate">{sc.phim?.tenPhim || 'N/A'}</div>
                        </td>
                        <td className="p-6 text-secondary">{sc.phong?.tenPhong || 'N/A'}</td>
                        <td className="p-6">
                          <div className="font-bold text-on-surface">{(sc.giaSuatChieu || sc.phim?.giaCoBan || 0).toLocaleString('vi-VN')}đ</div>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden w-24">
                              <div className={`h-full rounded-full ${fillPercentage > 90 ? 'bg-[#E50914]' : fillPercentage > 50 ? 'bg-orange-500' : 'bg-green-500'}`}
                                style={{ width: `${fillPercentage}%` }}></div>
                            </div>
                            <span className="text-xs font-bold text-secondary w-8">{fillPercentage}%</span>
                          </div>
                          <div className="text-[10px] text-secondary mt-1">{sc.soGheDat || 0} / {(sc.soGheDat || 0) + sc.soGheTrong} ghế</div>
                        </td>
                        <td className="p-6">
                          <span className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-2 w-fit ${
                            status === 'Đang chiếu' ? 'bg-[#E50914]/10 text-[#E50914] border border-[#E50914]/20'
                            : status === 'Sắp chiếu' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                            : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                          }`}>
                            {status === 'Đang chiếu' && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>}
                            {status}
                          </span>
                        </td>
                        <td className="p-6 text-right">
                          <button 
                            onClick={() => handleDelete(sc.id)}
                            className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#E50914] text-white flex items-center justify-center transition-colors ml-auto">
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default AdminSchedulesPage;