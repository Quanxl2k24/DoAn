import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const HeroBanner = () => {
  const [featuredMovie, setFeaturedMovie] = useState(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/phims?trangThai=DANG_CHIEU&limit=1');
        const movies = res.data.data || [];
        if (movies.length > 0) setFeaturedMovie(movies[0]);
      } catch (err) {
        console.error('Lỗi tải featured movie:', err);
      }
    };
    fetchFeatured();
  }, []);

  const posterSrc = featuredMovie?.backdropUrl || featuredMovie?.posterUrl || '/posterphim/dune.jpg';
  const movieTitle = featuredMovie?.tenPhim || 'DUNE: HÀNH TINH CÁT';
  const movieDuration = featuredMovie ? `${featuredMovie.thoiLuong} Phút` : '155 Phút';
  const movieGenre = featuredMovie?.theLoai || 'Hành động, Viễn tưởng';

  return (
    <section className="relative w-full h-[870px] overflow-hidden">
      {/* Background Image & Overlays */}
      <div className="absolute inset-0">
        <img
          alt="Hero Banner"
          className="w-full h-full object-cover transition-opacity duration-700"
          src={posterSrc}
        />
        {/* Lớp phủ tối dần từ dưới lên để nổi bật chữ */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent"></div>
        {/* Lớp phủ tối từ trái sang phải để tăng độ tương phản cho nội dung bên trái */}
        <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/20 to-transparent"></div>
      </div>

      {/* Content Container */}
      <div className="relative h-full flex flex-col justify-end px-6 md:px-16 pb-20 max-w-[1920px] mx-auto">
        {/* Badge: Phim Đang Hot */}
        <div className="inline-flex items-center gap-2 bg-primary-container/20 text-primary-fixed border border-primary-container/30 px-3 py-1 rounded-full w-fit mb-6">
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
          <span className="text-xs font-bold tracking-widest uppercase">Phim Đang Hot</span>
        </div>

        {/* Title */}
        <h2 className="font-headline text-5xl md:text-8xl font-black tracking-tighter mb-4 leading-[0.9]">
          {movieTitle}
        </h2>

        {/* Movie Info */}
        <div className="flex flex-wrap items-center gap-6 text-secondary mb-8 font-body">
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">schedule</span> {movieDuration}
          </span>
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">theater_comedy</span> {movieGenre}
          </span>
          {featuredMovie?.phanLoaiTuoi && (
            <span className="bg-[#E50914] text-white text-xs font-black px-2 py-1 rounded">
              {featuredMovie.phanLoaiTuoi}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          {featuredMovie ? (
            <Link
              to={`/showtimes?phimId=${featuredMovie.id}`}
              className="bg-primary-container text-on-primary-container px-8 py-4 rounded-md font-bold text-lg flex items-center gap-3 hover:scale-105 transition-all duration-300"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>confirmation_number</span>
              ĐẶT VÉ NGAY
            </Link>
          ) : (
            <Link
              to="/showtimes"
              className="bg-primary-container text-on-primary-container px-8 py-4 rounded-md font-bold text-lg flex items-center gap-3 hover:scale-105 transition-all duration-300"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>confirmation_number</span>
              ĐẶT VÉ NGAY
            </Link>
          )}
          {featuredMovie?.trailerUrl ? (
            <a
              href={featuredMovie.trailerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-surface-container-highest/40 backdrop-blur-md text-white border border-white/10 px-8 py-4 rounded-md font-bold text-lg flex items-center gap-3 hover:bg-white/10 transition-all"
            >
              <span className="material-symbols-outlined">play_circle</span>
              XEM TRAILER
            </a>
          ) : (
            <button className="bg-surface-container-highest/40 backdrop-blur-md text-white border border-white/10 px-8 py-4 rounded-md font-bold text-lg flex items-center gap-3 hover:bg-white/10 transition-all">
              <span className="material-symbols-outlined">play_circle</span>
              XEM TRAILER
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;