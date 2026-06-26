import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import { SkeletonTable } from '../../components/Skeleton';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { tinhGiaVe, tinhPhuPhiTheoGio, tinhPhuPhiTheoNgay, tinhPhuPhiLoaiGhe } from '../../utils/pricing';

const PHU_PHI_VIP = 20000;
const PHU_PHI_DOI = 40000;
const PHU_PHI_THUONG = 0;
const PHU_PHI_TRUOC_17H = 0;
const PHU_PHI_17H_DEN_22H = 15000;
const PHU_PHI_SAU_22H = 10000;
const PHU_PHI_THU_7_CHU_NHAT = 15000;

const AdminSchedulesPage = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString('en-CA'));

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
    apDungPhuPhiCuoiTuan: true,
    apDungPhuPhiNgayLe: true,
    apDungPhuPhiTheoGio: true,
  });

  // Holiday management
  const [holidays, setHolidays] = useState([]);
  const [showHolidayForm, setShowHolidayForm] = useState(false);
  const [holidayForm, setHolidayForm] = useState({ tenNgayLe: '', ngay: '' });

  const fetchHolidays = async () => {
    try {
      const res = await api.get('/ngay-les');
      setHolidays(res.data.data || []);
    } catch {
      // silent
    }
  };

  const handleAddHoliday = async (e) => {
    e.preventDefault();
    if (!holidayForm.tenNgayLe || !holidayForm.ngay) {
      toast.error('Vui lòng nhập tên và ngày lễ');
      return;
    }
    try {
      await api.post('/admin/ngay-les', holidayForm);
      toast.success('Thêm ngày lễ thành công');
      setHolidayForm({ tenNgayLe: '', ngay: '' });
      setShowHolidayForm(false);
      fetchHolidays();
    } catch {
      toast.error('Lỗi thêm ngày lễ');
    }
  };

  const handleDeleteHoliday = async (id) => {
    if (!confirm('Xoá ngày lễ này?')) return;
    try {
      await api.delete(`/admin/ngay-les/${id}`);
      toast.success('Xoá ngày lễ thành công');
      fetchHolidays();
    } catch {
      toast.error('Lỗi xoá ngày lễ');
    }
  };

  // Check if selected date is a holiday
  const isHoliday = (dateStr) => {
    if (!dateStr || !holidays.length) return null;
    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);
    return holidays.find(h => {
      const hd = new Date(h.ngay);
      hd.setHours(0, 0, 0, 0);
      return d.getTime() === hd.getTime();
    }) || null;
  };

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
    fetchHolidays();
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
    if (!form.phimId || !form.phongId || !form.thoiGianBatDau) {
      toast.error('Vui lòng điền đủ thông tin');
      return;
    }
    
    // Convert to ISO-8601 for Prisma
    const submitData = {
      phimId: form.phimId,
      phongId: form.phongId,
      thoiGianBatDau: new Date(form.thoiGianBatDau).toISOString(),
      apDungPhuPhiCuoiTuan: form.apDungPhuPhiCuoiTuan,
      apDungPhuPhiNgayLe: form.apDungPhuPhiNgayLe,
      apDungPhuPhiTheoGio: form.apDungPhuPhiTheoGio,
    };

    try {
      await api.post('/suat-chieus', submitData);
      toast.success('Thêm suất chiếu thành công');
      setShowForm(false);
      // Reset form
      setForm({ phimId: '', phongId: '', thoiGianBatDau: '', apDungPhuPhiCuoiTuan: true, apDungPhuPhiNgayLe: true, apDungPhuPhiTheoGio: true });
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
          <form onSubmit={handleSubmit} className="bg-surface-container-low p-6 rounded-2xl border border-white/5 mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1">Phim</label>
              <select 
                value={form.phimId} 
                onChange={(e) => {
                  setForm({ ...form, phimId: e.target.value });
                }}
                className="w-full bg-white text-black px-4 py-2 rounded-lg border border-white/5" 
                required
              >
                <option value="">Chọn phim</option>
                {phims.map(p => <option key={p.id} value={p.id}>{p.tenPhim}</option>)}
              </select>
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

            {/* Pricing Toggles */}
            <div className="md:col-span-2 bg-surface-container-high rounded-xl p-4 border border-white/5">
              <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-3">CẤU HÌNH PHỤ PHÍ</p>
              <div className="space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-sm font-bold text-on-surface">Phụ phí theo giờ</span>
                    <p className="text-[10px] text-secondary">17h-22h: <span className="text-[#E50914] font-bold">+{PHU_PHI_17H_DEN_22H.toLocaleString('vi-VN')}₫</span> | Sau 22h: <span className="text-[#E50914] font-bold">+{PHU_PHI_SAU_22H.toLocaleString('vi-VN')}₫</span></p>
                  </div>
                  <div className={`relative w-12 h-7 rounded-full transition-colors ${form.apDungPhuPhiTheoGio ? 'bg-[#E50914]' : 'bg-gray-600'}`}
                    onClick={() => setForm({ ...form, apDungPhuPhiTheoGio: !form.apDungPhuPhiTheoGio })}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white transition-transform ${form.apDungPhuPhiTheoGio ? 'translate-x-5' : ''}`} />
                  </div>
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-sm font-bold text-on-surface">Phụ phí cuối tuần</span>
                    <p className="text-[10px] text-secondary">Thứ Bảy, Chủ Nhật: <span className="text-[#E50914] font-bold">+{PHU_PHI_THU_7_CHU_NHAT.toLocaleString('vi-VN')}₫</span></p>
                  </div>
                  <div className={`relative w-12 h-7 rounded-full transition-colors ${form.apDungPhuPhiCuoiTuan ? 'bg-[#E50914]' : 'bg-gray-600'}`}
                    onClick={() => setForm({ ...form, apDungPhuPhiCuoiTuan: !form.apDungPhuPhiCuoiTuan })}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white transition-transform ${form.apDungPhuPhiCuoiTuan ? 'translate-x-5' : ''}`} />
                  </div>
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-sm font-bold text-on-surface">Phụ phí ngày lễ</span>
                    <p className="text-[10px] text-secondary">Ngày lễ, Tết: <span className="text-[#E50914] font-bold">+25,000₫</span></p>
                  </div>
                  <div className={`relative w-12 h-7 rounded-full transition-colors ${form.apDungPhuPhiNgayLe ? 'bg-[#E50914]' : 'bg-gray-600'}`}
                    onClick={() => setForm({ ...form, apDungPhuPhiNgayLe: !form.apDungPhuPhiNgayLe })}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white transition-transform ${form.apDungPhuPhiNgayLe ? 'translate-x-5' : ''}`} />
                  </div>
                </label>
              </div>

              {/* Holiday list */}
              <div className="mt-4 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-secondary">Ngày lễ hiện có</span>
                  <button type="button" onClick={() => setShowHolidayForm(!showHolidayForm)}
                    className="text-[10px] text-[#E50914] font-bold hover:underline"
                  >
                    {showHolidayForm ? 'ĐÓNG' : '+ THÊM NGÀY LỄ'}
                  </button>
                </div>

                {showHolidayForm && (
                  <div className="mb-3 p-3 bg-surface rounded-xl space-y-2">
                    <input type="text" value={holidayForm.tenNgayLe}
                      onChange={(e) => setHolidayForm({ ...holidayForm, tenNgayLe: e.target.value })}
                      placeholder="Tên ngày lễ (VD: Tết Dương Lịch)"
                      className="w-full bg-white text-black px-2 py-1.5 rounded text-xs border border-white/5" />
                    <input type="date" value={holidayForm.ngay}
                      onChange={(e) => setHolidayForm({ ...holidayForm, ngay: e.target.value })}
                      className="w-full bg-white text-black px-2 py-1.5 rounded text-xs border border-white/5" />
                    <button type="button" onClick={handleAddHoliday}
                      className="w-full bg-[#E50914] text-white py-1.5 rounded text-xs font-bold hover:bg-red-700"
                    >THÊM</button>
                  </div>
                )}

                <div className="space-y-1 max-h-[200px] overflow-y-auto">
                  {holidays.length === 0 ? (
                    <p className="text-[10px] text-secondary italic">Chưa có ngày lễ nào</p>
                  ) : holidays.map(h => (
                    <div key={h.id} className="flex items-center justify-between bg-surface rounded-lg px-2 py-1.5">
                      <div>
                        <span className="text-xs font-bold text-on-surface">{h.tenNgayLe}</span>
                        <span className="text-[10px] text-secondary ml-2">{new Date(h.ngay).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <button type="button" onClick={() => handleDeleteHoliday(h.id)}
                        className="text-[#E50914] text-[14px] hover:opacity-70 material-symbols-outlined"
                      >close</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Price Preview */}
            {form.phimId && form.thoiGianBatDau && (
              <div className="md:col-span-3 bg-surface-container-high rounded-xl p-4 border border-white/5">
                <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-3">DỰ KIẾN GIÁ VÉ</p>
                {(() => {
                  const movie = phims.find(p => p.id === form.phimId);
                  if (!movie) return null;
                  const giaCoBan = movie.giaCoBan || 0;
                  const ngayChieu = new Date(form.thoiGianBatDau);
                  const gioBatDau = ngayChieu.getHours();
                  const thu = ngayChieu.getDay();
                  const phuPhiTime = form.apDungPhuPhiTheoGio ? tinhPhuPhiTheoGio(gioBatDau) : 0;
                  const holiday = isHoliday(form.thoiGianBatDau);
                  const phuPhiNgay = holiday && form.apDungPhuPhiNgayLe ? 25000
                    : form.apDungPhuPhiCuoiTuan && (thu === 6 || thu === 0) ? PHU_PHI_THU_7_CHU_NHAT
                    : 0;
                  const phuPhiNgayLabel = holiday ? holiday.tenNgayLe
                    : phuPhiNgay > 0 ? 'Cuối tuần'
                    : '';
                  return (
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between py-0.5">
                        <span className="text-secondary">Giá cơ bản ({movie.dinhDang || '2D'})</span>
                        <span className="font-bold text-on-surface">{giaCoBan.toLocaleString('vi-VN')}₫</span>
                      </div>
                      {phuPhiTime > 0 && (
                        <div className="flex justify-between py-0.5">
                          <span className="text-secondary">Phụ phí giờ ({gioBatDau}h)</span>
                          <span className="font-bold text-orange-500">+{phuPhiTime.toLocaleString('vi-VN')}₫</span>
                        </div>
                      )}
                      {phuPhiNgay > 0 && (
                        <div className="flex justify-between py-0.5">
                          <span className="text-secondary">Phụ phí ngày ({phuPhiNgayLabel})</span>
                          <span className="font-bold text-[#E50914]">+{phuPhiNgay.toLocaleString('vi-VN')}₫</span>
                        </div>
                      )}
                      <div className="flex justify-between py-1.5 pt-2 border-t border-white/10">
                        <span className="font-bold text-on-surface">Giá vé ghế Thường</span>
                        <span className="font-black text-lg text-[#E50914]">{(giaCoBan + phuPhiTime + phuPhiNgay).toLocaleString('vi-VN')}₫</span>
                      </div>
                      <div className="flex justify-between py-0.5">
                        <span className="font-bold text-on-surface">Giá vé ghế VIP</span>
                        <span className="font-black text-[#E50914]">{(giaCoBan + PHU_PHI_VIP + phuPhiTime + phuPhiNgay).toLocaleString('vi-VN')}₫</span>
                      </div>
                      <div className="flex justify-between py-0.5">
                        <span className="font-bold text-on-surface">Giá vé ghế Đôi</span>
                        <span className="font-black text-pink-500">{(giaCoBan + PHU_PHI_DOI + phuPhiTime + phuPhiNgay).toLocaleString('vi-VN')}₫</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            <div className="md:col-span-3 mt-2 flex gap-4">
              <button type="submit" className="bg-[#E50914] text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 transition-colors">
                LƯU SUẤT CHIẾU
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="bg-white/10 text-on-surface px-6 py-3 rounded-xl font-bold hover:bg-white/20 transition-colors border border-white/10">
                HUỶ
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