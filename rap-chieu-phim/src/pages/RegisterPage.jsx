import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { registerUser } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Mật khẩu không khớp!");
    }
    
    // Tạo data bỏ confirmPassword
    const { confirmPassword, ...submitData } = formData;
    
    const loadingToast = toast.loading("Đang đăng ký...");
    try {
      await registerUser(submitData);
      toast.success("Đăng ký thành công!", { id: loadingToast });
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Lỗi đăng ký", { id: loadingToast });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-surface overflow-hidden py-12">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/posterphim/harryposter.jpg"
          alt="Cinema Background"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-surface/40"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-6 py-10 bg-surface-container-high/60 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl">
        <div className="text-center mb-8">
          <Link to="/">
            <h1 className="text-3xl font-black italic text-[#E50914] tracking-tighter font-['Epilogue'] mb-2">CINE PREMIÈRE</h1>
          </Link>
          <p className="text-secondary font-body">Tạo tài khoản thành viên mới</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-bold text-on-surface mb-2 font-label">Họ và tên</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-3 text-black focus:outline-none focus:border-[#E50914] transition-colors placeholder:text-neutral-400"
              placeholder="Nguyễn Văn A"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-on-surface mb-2 font-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-3 text-black focus:outline-none focus:border-[#E50914] transition-colors placeholder:text-neutral-400"
              placeholder="example@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-on-surface mb-2 font-label">Số điện thoại</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-3 text-black focus:outline-none focus:border-[#E50914] transition-colors placeholder:text-neutral-400"
              placeholder="0912 345 678"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-on-surface mb-2 font-label">Mật khẩu</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-3 text-black focus:outline-none focus:border-[#E50914] transition-colors placeholder:text-neutral-400"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-on-surface mb-2 font-label">Xác nhận mật khẩu</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-3 text-black focus:outline-none focus:border-[#E50914] transition-colors placeholder:text-neutral-400"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#E50914] text-white font-bold py-4 rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-900/20 mt-4"
          >
            ĐĂNG KÝ
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-secondary">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-[#E50914] font-bold hover:underline">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
