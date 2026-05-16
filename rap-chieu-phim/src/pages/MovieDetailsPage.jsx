import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../utils/api';

const MovieDetailsPage = () => {
  const { id } = useParams();
  const [phim, setPhim] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhim = async () => {
      try {
        const res = await api.get(`/phims/${id}`);
        setPhim(res.data.data);
      } catch (error) {
        console.error('Lỗi tải phim:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPhim();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-on-surface text-xl">Đang tải...</div>
      </div>
    );
  }

  if (!phim) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-on-surface text-xl">Không tìm thấy phim</div>
      </div>
    );
  }

  const actors = phim.dienVien ? phim.dienVien.split(',').map((a) => a.trim()) : [];

  return (
    <>
      <Header />
      <main className="pb-24 bg-surface min-h-screen">
        {/* Hero Section */}
        <section className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={phim.backdropUrl || phim.posterUrl}
              alt={phim.tenPhim}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/40 to-transparent"></div>
          </div>

          <div className="relative h-full flex flex-col justify-end px-6 md:px-16 pb-12 max-w-[1920px] mx-auto">
            <div className="flex flex-col md:flex-row gap-8 items-end">
              <div className="hidden md:block w-64 shrink-0 rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black">
                <img src={phim.posterUrl} alt={phim.tenPhim} className="w-full object-cover" />
              </div>

              <div className="flex-1">
                <div className="inline-flex items-center gap-2 bg-[#E50914] text-white px-3 py-1 rounded-sm w-fit mb-4">
                  <span className="text-xs font-bold tracking-widest">{phim.phanLoaiTuoi}</span>
                </div>
                <h1 className="font-headline text-5xl md:text-7xl font-black tracking-tighter mb-4 leading-none text-on-surface">{phim.tenPhim}</h1>

                <div className="flex flex-wrap items-center gap-6 text-secondary mb-6 font-body text-sm">
                  <span className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-sm">schedule</span> {phim.thoiLuong} Phút</span>
                  <span className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-sm">theater_comedy</span> {phim.theLoai}</span>
                  <span className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-sm">language</span> {phim.ngonNgu}</span>
                </div>

                <div className="flex gap-4">
                  <Link to={`/showtimes?phimId=${phim.id}`} className="bg-[#E50914] text-white px-8 py-4 rounded-md font-bold text-lg flex items-center gap-3 hover:scale-105 transition-all shadow-lg shadow-red-900/30">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>confirmation_number</span>
                    MUA VÉ NGAY
                  </Link>
                  {phim.trailerUrl && (
                    <a href={phim.trailerUrl} target="_blank" rel="noopener noreferrer" className="bg-surface-container-highest/40 backdrop-blur-md text-white border border-white/10 px-8 py-4 rounded-md font-bold text-lg flex items-center gap-3 hover:bg-white/10 transition-all">
                      <span className="material-symbols-outlined">play_circle</span>
                      TRAILER
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Details */}
        <section className="px-6 md:px-16 pt-16 max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2">
            {/* Synopsis */}
            <h3 className="font-headline text-2xl font-bold tracking-tight mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#E50914] block"></span> NỘI DUNG PHIM
            </h3>
            <p className="text-secondary leading-relaxed font-body mb-12 text-lg">{phim.moTa}</p>

            {phim.daoDien && (
              <>
                <h3 className="font-headline text-2xl font-bold tracking-tight mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-[#E50914] block"></span> ĐẠO DIỄN
                </h3>
                <div className="flex items-center gap-4 mb-12 bg-surface-container-low p-4 rounded-2xl w-fit border border-white/5">
                  <div className="w-20 h-20 rounded-full bg-neutral-800 overflow-hidden shadow-lg border border-white/10 flex items-center justify-center text-2xl font-bold text-secondary">
                    {phim.daoDien.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-xl text-on-surface">{phim.daoDien}</p>
                    <p className="text-sm text-[#E50914] font-medium uppercase tracking-widest">Director</p>
                  </div>
                </div>
              </>
            )}

            {actors.length > 0 && (
              <>
                <h3 className="font-headline text-2xl font-bold tracking-tight mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-[#E50914] block"></span> DIỄN VIÊN CHÍNH
                </h3>
                <div className="flex flex-wrap gap-3 mb-12">
                  {actors.map((actor, i) => (
                    <span key={i} className="bg-surface-container-low px-4 py-2 rounded-full border border-white/5 text-on-surface font-medium">
                      {actor}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Right Column - Info */}
          <div className="relative">
            <div className="bg-surface-container-low rounded-2xl p-8 border border-white/5 sticky top-24">
              <h4 className="font-headline text-xl font-bold mb-6 border-b border-white/5 pb-4 text-[#E50914]">THÔNG TIN CHI TIẾT</h4>
              <ul className="space-y-4 text-sm">
                <li className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-secondary">Đạo diễn</span>
                  <span className="font-bold text-on-surface">{phim.daoDien || 'Đang cập nhật'}</span>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-secondary">Ngày khởi chiếu</span>
                  <span className="font-bold text-on-surface">{new Date(phim.ngayKhoiChieu).toLocaleDateString('vi-VN')}</span>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-secondary">Thể loại</span>
                  <span className="font-bold text-on-surface">{phim.theLoai}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-secondary">Ngôn ngữ</span>
                  <span className="font-bold text-on-surface">{phim.ngonNgu}</span>
                </li>
              </ul>
              <Link
                to={`/showtimes?phimId=${phim.id}`}
                className="mt-8 block w-full text-center bg-[#E50914] text-white font-bold py-4 rounded-xl hover:bg-red-700 transition-all"
              >
                ĐẶT VÉ NGAY
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default MovieDetailsPage;