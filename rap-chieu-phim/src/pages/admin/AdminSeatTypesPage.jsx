import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const AdminSeatTypesPage = () => {
  const [seatTypes, setSeatTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ tenLoai: '', phuPhi: 0 });
  const [deleting, setDeleting] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/loai-ghes');
      setSeatTypes(res.data.data || []);
    } catch (err) {
      toast.error('Lỗi tải danh sách loại ghế');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setIsEditing(false);
    setEditId(null);
    setForm({ tenLoai: '', phuPhi: 0 });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setIsEditing(true);
    setEditId(item.id);
    setForm({ tenLoai: item.tenLoai, phuPhi: item.phuPhi });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.tenLoai.trim()) {
      toast.error('Vui lòng nhập tên loại ghế');
      return;
    }
    try {
      if (isEditing) {
        await api.put(`/loai-ghes/${editId}`, form);
        toast.success('Cập nhật loại ghế thành công');
      } else {
        await api.post('/loai-ghes', form);
        toast.success('Tạo loại ghế thành công');
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi xử lý');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xoá loại ghế này?')) return;
    setDeleting(id);
    try {
      await api.delete(`/loai-ghes/${id}`);
      toast.success('Xoá loại ghế thành công');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi xoá loại ghế');
    } finally {
      setDeleting(null);
    }
  };

  const getTypeColor = (tenLoai) => {
    const map = {
      'THUONG': 'border-white/20 text-white/40',
      'VIP': 'border-amber-500/50 text-amber-500',
      'SWEETBOX': 'border-pink-500/50 text-pink-500',
    };
    return map[tenLoai] || 'border-blue-500/50 text-blue-500';
  };

  const getTypeBadge = (tenLoai) => {
    const map = {
      'THUONG': 'bg-white/10 text-gray-300',
      'VIP': 'bg-amber-500/10 text-amber-500',
      'SWEETBOX': 'bg-pink-500/10 text-pink-500',
    };
    return map[tenLoai] || 'bg-blue-500/10 text-blue-500';
  };

  return (
    <>
      <Sidebar />
      <main className="ml-64 p-12 min-h-screen bg-surface">
        <AdminHeader title="LOẠI GHẾ" subtitle="Quản lý loại ghế và phụ phí" />

        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="font-headline text-3xl font-bold text-on-surface mb-2">Loại ghế</h1>
            <p className="text-secondary opacity-70">Cấu hình các loại ghế và phí cộng thêm khi đặt vé</p>
          </div>
          <button
            onClick={openCreate}
            className="bg-[#E50914] hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-lg shadow-red-900/20"
          >
            <span className="material-symbols-outlined">add</span>
            Thêm Loại Ghế
          </button>
        </div>

        {loading ? (
          <div className="text-center text-secondary py-20">Đang tải...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {seatTypes.map((type) => (
              <div
                key={type.id}
                className="bg-surface-container-low rounded-2xl border border-white/5 p-6 hover:border-white/10 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getTypeBadge(type.tenLoai)}`}>
                      {type.tenLoai}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEdit(type)}
                      className="p-2 text-secondary hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      title="Chỉnh sửa"
                    >
                      <span className="material-symbols-outlined text-lg">edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(type.id)}
                      disabled={deleting === type.id}
                      className="p-2 text-secondary hover:text-[#E50914] hover:bg-[#E50914]/10 rounded-lg transition-colors disabled:opacity-50"
                      title="Xoá"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-secondary uppercase tracking-widest mb-1">Phụ phí</p>
                    <p className="font-black text-2xl text-[#E50914]">
                      {type.phuPhi?.toLocaleString('vi-VN')}đ
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center ${getTypeColor(type.tenLoai)}`}>
                    <span className="material-symbols-outlined text-2xl">
                      {type.tenLoai === 'VIP' ? 'star' : type.tenLoai === 'SWEETBOX' ? 'favorite' : 'event_seat'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {seatTypes.length === 0 && (
              <div className="col-span-full text-center text-secondary py-20">
                <span className="material-symbols-outlined text-6xl mb-4 block">event_seat</span>
                <p className="text-lg font-bold mb-2">Chưa có loại ghế nào</p>
                <p className="text-sm">Nhấn "Thêm Loại Ghế" để tạo cấu hình ghế mới</p>
              </div>
            )}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-[#1C1B1B] w-full max-w-md rounded-2xl border border-white/5 p-8 shadow-2xl">
              <h2 className="font-headline text-2xl font-bold text-white mb-6">
                {isEditing ? 'Cập nhật loại ghế' : 'Thêm loại ghế mới'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">Tên loại ghế</label>
                  <input
                    type="text"
                    required
                    value={form.tenLoai}
                    onChange={(e) => setForm({ ...form, tenLoai: e.target.value.toUpperCase() })}
                    className="w-full bg-white text-black px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#E50914] transition-all"
                    placeholder="VD: THUONG, VIP, SWEETBOX..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">
                    Phụ phí (VNĐ)
                    <span className="text-xs text-gray-500 ml-2 font-normal">- Số tiền cộng thêm khi đặt loại ghế này</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={form.phuPhi}
                    onChange={(e) => setForm({ ...form, phuPhi: parseInt(e.target.value) || 0 })}
                    className="w-full bg-white text-black px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#E50914] transition-all"
                    placeholder="0"
                  />
                </div>
                {form.phuPhi > 0 && (
                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                    <p className="text-sm text-amber-500">
                      <span className="font-bold">Lưu ý:</span> Ghế loại <strong>{form.tenLoai || '...'}</strong> sẽ có phụ phí{' '}
                      <strong>{form.phuPhi.toLocaleString('vi-VN')}đ</strong> cộng vào giá vé cơ bản.
                    </p>
                  </div>
                )}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-3 rounded-xl font-bold text-gray-400 hover:bg-white/5 transition-colors"
                  >
                    HỦY
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#E50914] hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-red-900/20"
                  >
                    {isEditing ? 'CẬP NHẬT' : 'TẠO MỚI'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default AdminSeatTypesPage;
