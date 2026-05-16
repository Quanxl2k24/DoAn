import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminFooter from '../../components/admin/AdminFooter';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const AdminMoviesPage = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editMovie, setEditMovie] = useState(null);
  const [form, setForm] = useState({
    tenPhim: '', moTa: '', posterUrl: '', backdropUrl: '', thoiLuong: 120,
    ngayKhoiChieu: '', theLoai: '', ngonNgu: 'Phụ đề Tiếng Việt',
    daoDien: '', phanLoaiTuoi: 'P', giaCoBan: 100000, trangThai: 'DANG_CHIEU',
  });

  useEffect(() => { fetchMovies(); }, []);

  const fetchMovies = async () => {
    try {
      const res = await api.get('/phims?limit=50');
      setMovies(res.data.data || []);
    } catch (error) {
      toast.error('Lỗi tải danh sách phim');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Format ngày sang chuẩn ISO-8601 để Prisma không báo lỗi premature end of input
      const submitData = { ...form };
      if (submitData.ngayKhoiChieu && !submitData.ngayKhoiChieu.includes('T')) {
        submitData.ngayKhoiChieu = new Date(submitData.ngayKhoiChieu).toISOString();
      }

      if (editMovie) {
        await api.put(`/phims/${editMovie.id}`, submitData);
        toast.success('Cập nhật phim thành công');
      } else {
        const res = await api.post('/phims', submitData);
        toast.success('Thêm phim thành công');
        // Prompt to add schedule
        if (window.confirm('Phim đã được tạo! Bạn có muốn lên lịch chiếu cho phim này ngay bây giờ không?')) {
          navigate(`/admin/schedules?phimId=${res.data.data.id}`);
          return;
        }
      }
      setShowForm(false);
      setEditMovie(null);
      resetForm();
      fetchMovies();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi');
    }
  };

  const handleEdit = (movie) => {
    setEditMovie(movie);
    setForm({
      tenPhim: movie.tenPhim, moTa: movie.moTa, posterUrl: movie.posterUrl,
      backdropUrl: movie.backdropUrl || '', thoiLuong: movie.thoiLuong,
      ngayKhoiChieu: movie.ngayKhoiChieu?.slice(0, 10) || '', theLoai: movie.theLoai,
      ngonNgu: movie.ngonNgu, daoDien: movie.daoDien || '',
      phanLoaiTuoi: movie.phanLoaiTuoi, giaCoBan: movie.giaCoBan, trangThai: movie.trangThai,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Xoá phim này?')) return;
    try {
      await api.delete(`/phims/${id}`);
      toast.success('Xoá phim thành công');
      fetchMovies();
    } catch (error) {
      toast.error('Lỗi xoá phim');
    }
  };

  const resetForm = () => setForm({
    tenPhim: '', moTa: '', posterUrl: '', backdropUrl: '', thoiLuong: 120,
    ngayKhoiChieu: '', theLoai: '', ngonNgu: 'Phụ đề Tiếng Việt',
    daoDien: '', phanLoaiTuoi: 'P', giaCoBan: 100000, trangThai: 'DANG_CHIEU',
  });

  return (
    <>
      <Sidebar />
      <main className="ml-64 p-12 min-h-screen bg-surface">
        <AdminHeader title="QUẢN LÝ PHIM" subtitle="Thêm, sửa, xoá phim chiếu" />
        <button onClick={() => { setEditMovie(null); resetForm(); setShowForm(!showForm); }}
          className="mb-6 bg-[#E50914] text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700">
          {showForm ? 'ĐÓNG' : '+ THÊM PHIM'}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-surface-container-low p-6 rounded-2xl border border-white/5 mb-8 grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-bold mb-1">Tên phim</label>
              <input value={form.tenPhim} onChange={(e) => setForm({ ...form, tenPhim: e.target.value })}
                className="w-full bg-white text-black px-4 py-2 rounded-lg border border-white/5" required />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-bold mb-1">Mô tả</label>
              <textarea value={form.moTa} onChange={(e) => setForm({ ...form, moTa: e.target.value })}
                className="w-full bg-white text-black px-4 py-2 rounded-lg border border-white/5 h-24" required />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Poster URL</label>
              <input value={form.posterUrl} onChange={(e) => setForm({ ...form, posterUrl: e.target.value })}
                className="w-full bg-white text-black px-4 py-2 rounded-lg border border-white/5" required />
            </div>
            <div><label className="block text-sm font-bold mb-1">Thời lượng</label>
              <input type="number" value={form.thoiLuong} onChange={(e) => setForm({ ...form, thoiLuong: Number(e.target.value) })}
                className="w-full bg-white text-black px-4 py-2 rounded-lg border border-white/5" required /></div>
            <div><label className="block text-sm font-bold mb-1">Ngày khởi chiếu</label>
              <input type="date" value={form.ngayKhoiChieu} onChange={(e) => setForm({ ...form, ngayKhoiChieu: e.target.value })}
                className="w-full bg-white text-black px-4 py-2 rounded-lg border border-white/5" required /></div>
            <div><label className="block text-sm font-bold mb-1">Thể loại</label>
              <input value={form.theLoai} onChange={(e) => setForm({ ...form, theLoai: e.target.value })}
                className="w-full bg-white text-black px-4 py-2 rounded-lg border border-white/5" required /></div>
            <div><label className="block text-sm font-bold mb-1">Phân loại</label>
              <select value={form.phanLoaiTuoi} onChange={(e) => setForm({ ...form, phanLoaiTuoi: e.target.value })}
                className="w-full bg-white text-black px-4 py-2 rounded-lg border border-white/5">
                <option value="P">P</option><option value="C13">C13</option><option value="C16">C16</option><option value="T18">T18</option>
              </select></div>
            <div><label className="block text-sm font-bold mb-1">Giá cơ bản</label>
              <input type="number" value={form.giaCoBan} onChange={(e) => setForm({ ...form, giaCoBan: Number(e.target.value) })}
                className="w-full bg-white text-black px-4 py-2 rounded-lg border border-white/5" required /></div>
            <div><label className="block text-sm font-bold mb-1">Trạng thái</label>
              <select value={form.trangThai} onChange={(e) => setForm({ ...form, trangThai: e.target.value })}
                className="w-full bg-white text-black px-4 py-2 rounded-lg border border-white/5">
                <option value="DANG_CHIEU">Đang chiếu</option><option value="SAP_CHIEU">Sắp chiếu</option><option value="NGUNG_CHIEU">Ngừng chiếu</option>
              </select></div>
            <div className="col-span-2">
              <button type="submit" className="bg-[#E50914] text-white px-8 py-3 rounded-xl font-bold">{editMovie ? 'CẬP NHẬT' : 'THÊM PHIM'}</button>
            </div>
          </form>
        )}

        {loading ? <div className="text-center py-20 text-secondary">Đang tải...</div> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <div key={movie.id} className="bg-surface-container-low rounded-2xl border border-white/5 overflow-hidden group">
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img src={movie.posterUrl} alt={movie.tenPhim} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-80"></div>
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                      movie.trangThai === 'DANG_CHIEU' ? 'bg-[#E50914]/80 text-white' :
                      movie.trangThai === 'SAP_CHIEU' ? 'bg-blue-600/80 text-white' : 'bg-black/80 text-gray-400'
                    }`}>{movie.trangThai === 'DANG_CHIEU' ? 'ĐANG CHIẾU' : movie.trangThai === 'SAP_CHIEU' ? 'SẮP CHIẾU' : 'NGỪNG CHIẾU'}</span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-black ${movie.phanLoaiTuoi === 'T18' ? 'bg-[#E50914] text-white' : movie.phanLoaiTuoi === 'C13' ? 'bg-yellow-500 text-black' : 'bg-green-500 text-white'}`}>{movie.phanLoaiTuoi}</span>
                  </div>
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                    <button onClick={() => handleEdit(movie)} className="w-12 h-12 rounded-full bg-white/10 hover:bg-[#E50914] text-white flex items-center justify-center"><span className="material-symbols-outlined text-[20px]">edit</span></button>
                    <button onClick={() => handleDelete(movie.id)} className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"><span className="material-symbols-outlined text-[20px]">delete</span></button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-headline font-bold text-lg text-on-surface mb-1 truncate">{movie.tenPhim}</h3>
                  <div className="flex items-center justify-between text-xs text-secondary">
                    <span>{movie.theLoai?.split(',')[0]}</span>
                    <span>{movie.thoiLuong} phút</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
};

export default AdminMoviesPage;