import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Đang đăng nhập...");
    try {
      const res = await login(email, password);
      toast.success("Đăng nhập thành công!", { id: loadingToast });
      
      // Kiểm tra role để redirect
      if (res.user?.role?.name === 'ADMIN' || res.user?.roleId === 1) {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (error) {
      toast.error(error.message || "Email hoặc mật khẩu không chính xác", { id: loadingToast });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-surface overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/posterphim/hanhtinhcat2.jpg"
          alt="Cinema Background"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-surface/40"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-6 py-12 bg-surface-container-high/60 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl">
        <div className="text-center mb-8">
          <Link to="/">
            <h1 className="text-3xl font-black italic text-[#E50914] tracking-tighter font-['Epilogue'] mb-2">CINE PREMIÈRE</h1>
          </Link>
          <p className="text-secondary font-body">Đăng nhập để trải nghiệm điện ảnh</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-bold text-on-surface mb-2 font-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-3 text-black focus:outline-none focus:border-[#E50914] transition-colors placeholder:text-neutral-400"
              placeholder="Nhập email..."
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-bold text-on-surface font-label">Mật khẩu</label>
              <a href="#" className="text-xs text-[#E50914] hover:underline">Quên mật khẩu?</a>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-3 text-black focus:outline-none focus:border-[#E50914] transition-colors placeholder:text-neutral-400"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#E50914] text-white font-bold py-4 rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-900/20"
          >
            ĐĂNG NHẬP
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-secondary">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-[#E50914] font-bold hover:underline">
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
