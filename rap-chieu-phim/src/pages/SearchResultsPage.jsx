import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import Footer from '../components/Footer';
import { SkeletonCard } from '../components/Skeleton';
import api from '../utils/api';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/phims/search?q=${encodeURIComponent(q)}&limit=50`);
        setResults(res.data.data || []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [q]);

  return (
    <>
      <Header />
      <main className="pt-28 pb-24 min-h-screen bg-surface">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="mb-10">
            <h2 className="font-headline text-4xl font-bold tracking-tight mb-2 text-on-surface">
              KẾT QUẢ TÌM KIẾM
            </h2>
            <p className="text-secondary opacity-70">
              {q ? `Tìm thấy ${results.length} kết quả cho "${q}"` : 'Nhập từ khoá để tìm phim'}
            </p>
          </div>

          {loading ? (
            <SkeletonCard count={4} />
          ) : results.length === 0 ? (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-6xl text-secondary mb-4 block">search_off</span>
              <p className="text-secondary text-lg">
                {q ? `Không tìm thấy phim nào cho "${q}"` : 'Vui lòng nhập từ khoá tìm kiếm'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {results.map((movie) => (
                <Link
                  key={movie.id}
                  to={`/movie/${movie.id}`}
                  className="group bg-surface-container-low rounded-2xl border border-white/5 overflow-hidden hover:border-[#E50914]/50 transition-all"
                >
                  <div className="relative aspect-[2/3] overflow-hidden">
                    <img
                      src={movie.posterUrl}
                      alt={movie.tenPhim}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-80" />
                    <div className="absolute top-3 left-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black ${movie.phanLoaiTuoi === 'T18' ? 'bg-[#E50914] text-white' : movie.phanLoaiTuoi === 'C13' ? 'bg-yellow-500 text-black' : 'bg-green-500 text-white'}`}>
                        {movie.phanLoaiTuoi}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${movie.trangThai === 'DANG_CHIEU' ? 'bg-[#E50914]/80 text-white' : movie.trangThai === 'SAP_CHIEU' ? 'bg-blue-600/80 text-white' : 'bg-black/80 text-gray-400'}`}>
                        {movie.trangThai === 'DANG_CHIEU' ? 'ĐANG CHIẾU' : movie.trangThai === 'SAP_CHIEU' ? 'SẮP CHIẾU' : 'NGỪNG CHIẾU'}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-headline font-bold text-sm text-on-surface mb-1 truncate">{movie.tenPhim}</h3>
                    <div className="flex items-center justify-between text-xs text-secondary">
                      <span className="truncate">{movie.theLoai?.split(',')[0]}</span>
                      <span>{movie.thoiLuong} phút</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <BottomNav />
      <Footer />
    </>
  );
};

export default SearchResultsPage;
