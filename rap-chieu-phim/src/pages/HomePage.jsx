import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import HeroBanner from '../components/HeroBanner';
import MovieSection from '../components/MovieSection';
import PromoSection from '../components/PromoSection';
import BottomNav from '../components/BottomNav';
import Footer from '../components/Footer';
import { SkeletonCard } from '../components/Skeleton';
import api from '../utils/api';

const HomePage = () => {
  const [dangChieu, setDangChieu] = useState([]);
  const [sapChieu, setSapChieu] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dangChieuRes, sapChieuRes] = await Promise.all([
          api.get('/phims?trangThai=DANG_CHIEU&limit=10'),
          api.get('/phims?trangThai=SAP_CHIEU&limit=10'),
        ]);
        setDangChieu(dangChieuRes.data.data || []);
        setSapChieu(sapChieuRes.data.data || []);
      } catch (error) {
        console.error('Lỗi tải dữ liệu:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const mapPhimToMovieCard = (phim) => ({
    id: phim.id,
    title: phim.tenPhim,
    genre: phim.theLoai,
    image: phim.posterUrl,
    tag: phim.phanLoaiTuoi,
    tagStyle: phim.phanLoaiTuoi === 'P'
      ? 'bg-black/60 backdrop-blur-md border border-white/20'
      : 'bg-[#E50914]',
  });

  const mapPhimToUpcoming = (phim) => ({
    id: phim.id,
    title: phim.tenPhim,
    date: new Date(phim.ngayKhoiChieu).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
    image: phim.posterUrl,
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-surface">
        <Header />
        <div className="pt-28 pb-24 max-w-[1200px] mx-auto px-6">
          <div className="mb-6">
            <SkeletonCard count={4} />
          </div>
          <SkeletonCard count={4} />
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="pt-20 pb-24">
        <HeroBanner />
        <MovieSection
          title="PHIM ĐANG CHIẾU"
          description="Khám phá những siêu phẩm điện ảnh mới nhất tại rạp"
          linkText="Xem tất cả"
          movies={dangChieu.map(mapPhimToMovieCard)}
          isUpcoming={false}
        />
        <PromoSection />
        <MovieSection
          title="PHIM SẮP CHIẾU"
          movies={sapChieu.map(mapPhimToUpcoming)}
          isUpcoming={true}
        />
      </main>
      <BottomNav />
      <Footer />
    </>
  );
};

export default HomePage;