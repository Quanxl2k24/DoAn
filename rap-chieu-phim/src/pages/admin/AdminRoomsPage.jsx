import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import { SkeletonTable } from '../../components/Skeleton';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const AdminRoomsPage = () => {
  const [raps, setRaps] = useState([]);
  const [phongs, setPhongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRap, setSelectedRap] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPhongId, setCurrentPhongId] = useState(null);
  const [form, setForm] = useState({
    tenPhong: "",
    soHang: 10,
    soCot: 12,
    trangThai: "HOAT_DONG",
    rapId: "",
  });

  const fetchPhongs = async () => {
    if (!selectedRap) return;
    try {
      const res = await api.get(`/phongs/rap/${selectedRap}`);
      setPhongs(res.data.data || []);
    } catch (err) {
      toast.error("Lỗi tải danh sách phòng");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rapsRes = await api.get("/raps");
        setRaps(rapsRes.data.data || []);
        if (rapsRes.data.data?.length > 0) {
          setSelectedRap(rapsRes.data.data[0].id);
        }
      } catch (err) {
        toast.error("Lỗi tải danh sách rạp");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    fetchPhongs();
  }, [selectedRap]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/phongs/${currentPhongId}`, {
          tenPhong: form.tenPhong,
          trangThai: form.trangThai,
        });
        toast.success("Cập nhật phòng thành công");
      } else {
        if (!form.rapId) {
          toast.error("Vui lòng chọn rạp chiếu");
          return;
        }
        await api.post("/phongs", {
          tenPhong: form.tenPhong,
          soHang: form.soHang,
          soCot: form.soCot,
          rapId: form.rapId,
        });
        toast.success("Tạo phòng và sơ đồ ghế thành công");
      }
      setShowModal(false);
      resetForm(selectedRap);
      fetchPhongs();
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi xử lý");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá phòng này? Toàn bộ ghế và lịch chiếu liên quan sẽ bị ảnh hưởng.")) return;
    try {
      await api.delete(`/phongs/${id}`);
      toast.success("Xoá phòng thành công");
      fetchPhongs();
    } catch (err) {
      toast.error("Lỗi xoá phòng");
    }
  };

  const handleEdit = (phong) => {
    setIsEditing(true);
    setCurrentPhongId(phong.id);
    setForm({
      tenPhong: phong.tenPhong,
      soHang: 0,
      soCot: 0,
      trangThai: phong.trangThai,
    });
    setShowModal(true);
  };

  const resetForm = (rapId = "") => {
    setForm({ tenPhong: "", soHang: 10, soCot: 12, trangThai: "HOAT_DONG", rapId });
    setIsEditing(false);
    setCurrentPhongId(null);
  };

  return (
    <>
      <Sidebar />
      <main className="ml-64 p-12 min-h-screen bg-surface">
        <AdminHeader title="PHÒNG CHIẾU" subtitle="Quản lý danh sách và trạng thái các phòng chiếu" />

        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="font-headline text-3xl font-bold text-on-surface mb-2">Phòng chiếu</h1>
            <p className="text-secondary opacity-70">Quản lý danh sách và trạng thái các phòng chiếu</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedRap}
              onChange={(e) => setSelectedRap(e.target.value)}
              className="bg-white border border-neutral-300 text-black px-4 py-2 rounded-lg text-sm"
            >
              {raps.map(r => <option key={r.id} value={r.id}>{r.tenRap}</option>)}
            </select>
            <button 
              onClick={() => { resetForm(selectedRap); setShowModal(true); }}
              className="bg-[#E50914] hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-lg shadow-red-900/20">
              <span className="material-symbols-outlined">add</span>
              Thêm Phòng Mới
            </button>
          </div>
        </div>

        {loading ? (
          <div className="bg-surface-container-low rounded-2xl border border-white/5 overflow-hidden">
            <SkeletonTable rows={5} cols={5} />
          </div>
        ) : (
          <div className="bg-surface-container-low rounded-2xl border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 text-secondary text-sm border-b border-white/5">
                    <th className="p-6 font-medium">Tên Phòng</th>
                    <th className="p-6 font-medium">Rạp</th>
                    <th className="p-6 font-medium">Số ghế</th>
                    <th className="p-6 font-medium">Trạng Thái</th>
                    <th className="p-6 font-medium text-right">Hành Động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-on-surface">
                  {phongs.length === 0 ? (
                    <tr><td colSpan={5} className="p-12 text-center text-secondary">Chưa có phòng chiếu nào</td></tr>
                  ) : phongs.map((phong) => {
                    const rapName = raps.find(r => r.id === phong.rapId)?.tenRap || "";
                    return (
                      <tr key={phong.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-6">
                          <div className="font-bold flex items-center gap-3">
                            <span className="material-symbols-outlined text-secondary">meeting_room</span>
                            {phong.tenPhong}
                          </div>
                        </td>
                        <td className="p-6 text-secondary">{rapName}</td>
                        <td className="p-6 text-secondary">{phong.ghes?.length ?? 0} ghế</td>
                        <td className="p-6">
                          <div className="relative">
                            <span
                              onClick={() => document.getElementById(`status-${phong.id}`)?.classList.toggle('hidden')}
                              className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-2 w-fit cursor-pointer transition-all hover:opacity-80 ${
                                phong.trangThai === "HOAT_DONG"
                                  ? "bg-green-500/10 text-green-500 border border-green-500/20"
                                  : phong.trangThai === "BAO_TRI"
                                  ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                                  : "bg-red-500/10 text-red-500 border border-red-500/20"
                              }`}>
                              <span className={`w-1.5 h-1.5 rounded-full bg-current ${
                                phong.trangThai === "BAO_TRI" && "animate-pulse"
                              }`}></span>
                              {phong.trangThai === "HOAT_DONG" ? "Hoạt động" : phong.trangThai === "BAO_TRI" ? "Bảo trì" : "Ngừng hoạt động"}
                            </span>
                            <div id={`status-${phong.id}`} className="hidden absolute top-full left-0 mt-1 z-50 bg-[#1C1B1B] border border-white/10 rounded-xl shadow-2xl overflow-hidden min-w-[180px]">
                              {["HOAT_DONG", "BAO_TRI", "NGUNG_HOAT_DONG"].map((stt) => (
                                <button
                                  key={stt}
                                  onClick={async () => {
                                    document.getElementById(`status-${phong.id}`)?.classList.add('hidden');
                                    try {
                                      await api.put(`/phongs/${phong.id}`, { trangThai: stt });
                                      toast.success("Cập nhật trạng thái thành công");
                                      fetchPhongs();
                                    } catch {
                                      toast.error("Lỗi cập nhật trạng thái");
                                    }
                                  }}
                                  className={`w-full text-left px-4 py-3 text-sm font-medium flex items-center gap-2 hover:bg-white/10 transition-colors ${
                                    phong.trangThai === stt ? "text-white bg-white/5" : "text-gray-400"
                                  }`}
                                >
                                  <span className={`w-2 h-2 rounded-full ${
                                    stt === "HOAT_DONG" ? "bg-green-500" : stt === "BAO_TRI" ? "bg-yellow-500" : "bg-red-500"
                                  }`}></span>
                                  {stt === "HOAT_DONG" ? "Hoạt động" : stt === "BAO_TRI" ? "Bảo trì" : "Ngừng hoạt động"}
                                </button>
                              ))}
                            </div>
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center justify-end gap-2">
                            <Link to={`/admin/seats?phongId=${phong.id}`} className="p-2 text-secondary hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Sơ đồ ghế - Chọn để đổi loại ghế">
                              <span className="material-symbols-outlined text-xl">grid_view</span>
                            </Link>
                            <button 
                              onClick={() => handleEdit(phong)}
                              className="p-2 text-secondary hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Chỉnh sửa">
                              <span className="material-symbols-outlined text-xl">edit</span>
                            </button>
                            <button 
                              onClick={() => handleDelete(phong.id)}
                              className="p-2 text-secondary hover:text-[#E50914] hover:bg-[#E50914]/10 rounded-lg transition-colors" title="Xoá">
                              <span className="material-symbols-outlined text-xl">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal Thêm/Sửa Phòng */}
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-[#1C1B1B] w-full max-w-md rounded-2xl border border-white/5 p-8 shadow-2xl">
              <h2 className="font-headline text-2xl font-bold text-white mb-6">
                {isEditing ? "Cập nhật phòng" : "Thêm phòng chiếu mới"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">Tên phòng</label>
                  <input
                    type="text"
                    required
                    value={form.tenPhong}
                    onChange={(e) => setForm({ ...form, tenPhong: e.target.value })}
                    className="w-full bg-white text-black px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#E50914] transition-all"
                    placeholder="VD: Phòng 01, IMAX..."
                  />
                </div>

                {isEditing && (
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">Trạng thái</label>
                    <div className="grid grid-cols-3 gap-2">
                      {["HOAT_DONG", "BAO_TRI", "NGUNG_HOAT_DONG"].map((stt) => (
                        <button
                          key={stt}
                          type="button"
                          onClick={() => setForm({ ...form, trangThai: stt })}
                          className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                            form.trangThai === stt
                              ? stt === "HOAT_DONG"
                                ? "bg-green-500/20 text-green-400 border-green-500/40"
                                : stt === "BAO_TRI"
                                ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/40"
                                : "bg-red-500/20 text-red-400 border-red-500/40"
                              : "bg-white/5 text-gray-400 border-white/5 hover:bg-white/10"
                          }`}
                        >
                          <span className={`block w-1.5 h-1.5 rounded-full mx-auto mb-1 ${
                            stt === "HOAT_DONG" ? "bg-green-500" : stt === "BAO_TRI" ? "bg-yellow-500" : "bg-red-500"
                          }`}></span>
                          {stt === "HOAT_DONG" ? "Hoạt động" : stt === "BAO_TRI" ? "Bảo trì" : "Ngừng hoạt động"}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {!isEditing && (
                  <>
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">Rạp chiếu</label>
                    <select
                      value={form.rapId}
                      onChange={(e) => setForm({ ...form, rapId: e.target.value })}
                      className="w-full bg-white text-black px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#E50914] transition-all"
                      required
                    >
                      <option value="">-- Chọn rạp --</option>
                      {raps.map(r => <option key={r.id} value={r.id}>{r.tenRap}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-400 mb-2">Số hàng ghế</label>
                      <input
                        type="number"
                        min="1"
                        max="26"
                        required
                        value={form.soHang}
                        onChange={(e) => setForm({ ...form, soHang: parseInt(e.target.value) })}
                        className="w-full bg-white text-black px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#E50914] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-400 mb-2">Số ghế/hàng</label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={form.soCot}
                        onChange={(e) => setForm({ ...form, soCot: parseInt(e.target.value) })}
                        className="w-full bg-white text-black px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#E50914] transition-all"
                      />
                    </div>
                  </div>
                  </>
                )}

                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="material-symbols-outlined text-[#E50914] text-lg">info</span>
                    <p className="text-gray-400 text-xs">
                      Mặc định tất cả ghế tạo ra là <strong className="text-white">ghế Thường</strong>.
                      Sau khi tạo phòng, bạn có thể vào{' '}
                      <Link to="/admin/seats" className="text-[#E50914] underline">Sơ đồ ghế</Link>{' '}
                      để đổi sang ghế VIP hoặc Ghế đôi.
                    </p>
                  </div>
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
                    {isEditing ? "CẬP NHẬT" : "TẠO PHÒNG"}
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

export default AdminRoomsPage;
