import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, updateProfile, logout } = useAuth();
  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    phoneNumber: user?.phoneNumber || '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await updateProfile(form);
      toast.success('Cập nhật thông tin thành công');
    } catch (error) {
      toast.error(error.message || 'Lỗi cập nhật');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <p className="text-secondary">Vui lòng đăng nhập</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="pt-28 pb-24 min-h-screen bg-surface">
        <div className="max-w-[600px] mx-auto px-6">
          <div className="mb-12 text-center">
            <div className="w-24 h-24 rounded-full bg-[#E50914]/20 mx-auto mb-6 flex items-center justify-center border-2 border-[#E50914]">
              <span className="material-symbols-outlined text-5xl text-[#E50914]">person</span>
            </div>
            <h2 className="font-headline text-3xl font-bold text-on-surface">THÔNG TIN CÁ NHÂN</h2>
            <p className="text-secondary text-sm mt-2">{user.email}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-surface-container-low rounded-2xl p-8 border border-white/5">
            <div>
              <label className="block text-sm font-bold text-secondary mb-2">Họ và tên</label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full bg-white text-black px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E50914]"
                placeholder="Nhập họ tên..."
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-secondary mb-2">Số điện thoại</label>
              <input
                type="tel"
                value={form.phoneNumber}
                onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                className="w-full bg-white text-black px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E50914]"
                placeholder="Nhập số điện thoại..."
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-secondary mb-2">Email</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full bg-surface-container-highest text-secondary px-4 py-3 rounded-xl cursor-not-allowed"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-[#E50914] text-white font-bold py-4 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {submitting ? 'ĐANG LƯU...' : 'LƯU THAY ĐỔI'}
              </button>
              <button
                type="button"
                onClick={logout}
                className="px-6 py-4 rounded-xl font-bold text-[#E50914] border border-[#E50914]/30 hover:bg-[#E50914]/10 transition-colors"
              >
                ĐĂNG XUẤT
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <Link to="/history" className="text-secondary hover:text-on-surface transition-colors text-sm flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[16px]">receipt_long</span>
              Xem lịch sử giao dịch
            </Link>
          </div>
        </div>
      </main>
      <BottomNav />
      <Footer />
    </>
  );
};

export default ProfilePage;
