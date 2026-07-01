import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import { SkeletonTable } from '../../components/Skeleton';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const AdminTheatersPage = () => {
  const [raps, setRaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRapId, setCurrentRapId] = useState(null);
  const [form, setForm] = useState({
    tenRap: '',
    diaChi: ''
  });

  const fetchRaps = async () => {
    setLoading(true);
    try {
      const res = await api.get('/raps');
      setRaps(res.data.data || []);
    } catch (err) {
      toast.error('Lỗi tải danh sách rạp');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRaps();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/raps/${currentRapId}`, form);
        toast.success('Cập nhật rạp thành công');
      } else {
        await api.post('/raps', form);
        toast.success('Thêm rạp thành công');
      }
      setShowModal(false);
      resetForm();
      fetchRaps();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi xử lý');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xoá rạp này? Toàn bộ phòng chiếu và lịch chiếu liên quan sẽ bị xoá.')) return;
    try {
      await api.delete(`/raps/${id}`);
      toast.success('Xoá rạp thành công');
      fetchRaps();
    } catch (err) {
      toast.error('Lỗi xoá rạp');
    }
  };

  const handleEdit = (rap) => {
    setIsEditing(true);
    setCurrentRapId(rap.id);
    setForm({
      tenRap: rap.tenRap,
      diaChi: rap.diaChi
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setForm({ tenRap: '', diaChi: '' });
    setIsEditing(false);
    setCurrentRapId(null);
  };

  return (
    <>
      <Sidebar />
      <main className="ml-64 p-12 min-h-screen bg-surface text-on-surface">
        <AdminHeader title="RẠP CHIẾU" subtitle="Quản lý hệ thống các cụm rạp Noir Cinema" />

        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="font-headline text-3xl font-bold text-on-surface mb-2">Hệ thống rạp</h1>
            <p className="text-secondary opacity-70">Thêm, sửa hoặc xoá các cụm rạp trong hệ thống</p>
          </div>
          {raps.length === 0 && (
            <button 
              onClick={() => { resetForm(); setShowModal(true); }}
              className="bg-[#E50914] hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-lg shadow-red-900/20">
              <span className="material-symbols-outlined">add</span>
              Thêm Rạp Mới
            </button>
          )}
        </div>

        {loading ? (
          <div className="bg-surface-container-low rounded-2xl border border-white/5 overflow-hidden">
            <SkeletonTable rows={5} cols={4} />
          </div>
        ) : (
          <div className="bg-surface-container-low rounded-2xl border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 text-secondary text-sm border-b border-white/5">
                    <th className="p-6 font-medium">Tên Rạp</th>
                    <th className="p-6 font-medium">Địa Chỉ</th>
                    <th className="p-6 font-medium">Số Phòng</th>
                    <th className="p-6 font-medium text-right">Hành Động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {raps.length === 0 ? (
                    <tr><td colSpan={4} className="p-12 text-center text-secondary">Chưa có rạp chiếu nào</td></tr>
                  ) : raps.map((rap) => (
                    <tr key={rap.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-6 font-bold">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-[#E50914]">theater_comedy</span>
                          {rap.tenRap}
                        </div>
                      </td>
                      <td className="p-6 text-secondary text-sm italic">{rap.diaChi}</td>
                      <td className="p-6 text-secondary">{rap.phongChieus?.length || 0} phòng</td>
                      <td className="p-6">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleEdit(rap)}
                            className="p-2 text-secondary hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Chỉnh sửa">
                            <span className="material-symbols-outlined text-xl">edit</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal Thêm/Sửa Rạp */}
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-[#1C1B1B] w-full max-w-md rounded-2xl border border-white/5 p-8 shadow-2xl">
              <h2 className="font-headline text-2xl font-bold text-white mb-6">
                {isEditing ? "Cập nhật rạp" : "Thêm rạp chiếu mới"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">Tên rạp</label>
                  <input
                    type="text"
                    required
                    value={form.tenRap}
                    onChange={(e) => setForm({ ...form, tenRap: e.target.value })}
                    className="w-full bg-white text-black px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#E50914] transition-all"
                    placeholder="VD: Noir Cinema Quận 1..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">Địa chỉ</label>
                  <textarea
                    required
                    rows="3"
                    value={form.diaChi}
                    onChange={(e) => setForm({ ...form, diaChi: e.target.value })}
                    className="w-full bg-white text-black px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#E50914] transition-all resize-none"
                    placeholder="Nhập địa chỉ chi tiết..."
                  />
                </div>

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
                    {isEditing ? "CẬP NHẬT" : "TẠO RẠP"}
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

export default AdminTheatersPage;
