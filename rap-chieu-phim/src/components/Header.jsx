import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const fetchSuggestions = useCallback(async (q) => {
    if (!q.trim()) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await api.get(`/phims/search?q=${encodeURIComponent(q)}&limit=5`);
      setSuggestions(res.data.data || []);
    } catch {
      setSuggestions([]);
    }
  }, []);

  const handleSearchInput = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    setShowSuggestions(true);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 300);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    setShowSuggestions(false);
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  const handleSuggestionClick = (movieId) => {
    setShowSuggestions(false);
    setSearchQuery('');
    navigate(`/movie/${movieId}`);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#131313] dark:bg-neutral-950/80 backdrop-blur-xl shadow-2xl shadow-black/50">
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-[1920px] mx-auto">
        <div className="flex items-center gap-12">
          <Link to="/" className="text-2xl font-black italic text-[#E50914] tracking-tighter font-headline">
            CINE PREMIÈRE
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`font-bold font-headline tracking-tighter hover:scale-105 duration-300 transition-all ${location.pathname === '/' ? 'text-[#E50914] border-b-2 border-[#E50914] pb-1' : 'text-neutral-400 hover:text-white'}`}
            >
              Phim
            </Link>
            <Link
              to="/showtimes"
              className={`font-headline tracking-tighter hover:scale-105 duration-300 transition-all ${location.pathname === '/showtimes' ? 'text-[#E50914] border-b-2 border-[#E50914] pb-1 font-bold' : 'text-neutral-400 hover:text-white'}`}
            >
              Lịch Chiếu
            </Link>
            {user && (
              <Link
                to="/history"
                className={`font-headline tracking-tighter hover:scale-105 duration-300 transition-all ${location.pathname === '/history' ? 'text-[#E50914] border-b-2 border-[#E50914] pb-1 font-bold' : 'text-neutral-400 hover:text-white'}`}
              >
                Vé Của Tôi
              </Link>
            )}
            {user?.role?.name === 'ADMIN' && (
              <Link
                to="/admin"
                className={`font-headline tracking-tighter hover:scale-105 duration-300 transition-all ${location.pathname.startsWith('/admin') ? 'text-[#E50914] border-b-2 border-[#E50914] pb-1 font-bold' : 'text-neutral-400 hover:text-white'}`}
              >
                Quản Trị
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden lg:block relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit}>
              <div className="flex items-center bg-surface-container-high rounded-full px-4 py-2 gap-2 border border-white/5">
                <span className="material-symbols-outlined text-secondary opacity-70">search</span>
                <input
                  className="bg-transparent border-none focus:outline-none text-sm w-64 placeholder:text-neutral-500"
                  placeholder="Tìm tên phim, diễn viên..."
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchInput}
                  onFocus={() => setShowSuggestions(true)}
                />
              </div>
            </form>
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-surface-container-high rounded-xl border border-white/5 shadow-2xl overflow-hidden">
                {suggestions.map((movie) => (
                  <button
                    key={movie.id}
                    onClick={() => handleSuggestionClick(movie.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
                  >
                    <img
                      src={movie.posterUrl}
                      alt={movie.tenPhim}
                      className="w-10 h-14 rounded object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-on-surface truncate">{movie.tenPhim}</p>
                      <p className="text-xs text-secondary truncate">{movie.theLoai} &middot; {movie.thoiLuong} phút</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-4 text-on-surface">
            {user ? (
              <>
                <Link to="/history" className="hover:scale-105 transition-transform duration-300">
                  <span className="material-symbols-outlined">receipt_long</span>
                </Link>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold hidden md:block">{user.fullName || user.email}</span>
                  <button onClick={logout} className="text-sm text-[#E50914] hover:underline">Đăng xuất</button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-[#E50914] text-white px-4 py-2 rounded-md font-bold text-sm hover:bg-red-700 transition-colors"
              >
                ĐĂNG NHẬP
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;