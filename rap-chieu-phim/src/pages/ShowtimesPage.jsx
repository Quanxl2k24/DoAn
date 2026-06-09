import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Skeleton from '../components/Skeleton';
import api from '../utils/api';

const ShowtimesPage = () => {
  const [searchParams] = useSearchParams();
  const phimIdFromUrl = searchParams.get('phimId');

  const [selectedDate, setSelectedDate] = useState(0);
  const [suatChieus, setSuatChieus] = useState([]);
  const [loading, setLoading] = useState(true);

  // Generate 7 days from today
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dayNames = ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    return {
      date: d.getDate().toString(),
      day: i === 0 ? 'Hôm nay' : dayNames[d.getDay()],
      fullDate: d.toISOString().split('T')[0],
      active: i === 0,
    };
  });

  useEffect(() => {
    const fetchShowtimes = async () => {
      setLoading(true);
      try {
        const params = { ngay: dates[selectedDate]?.fullDate };
        if (phimIdFromUrl) params.phimId = phimIdFromUrl;

        const res = await api.get('/suat-chieus', { params });
        setSuatChieus(res.data.data || []);
      } catch (error) {
        console.error('Lỗi tải suất chiếu:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchShowtimes();
  }, [selectedDate, phimIdFromUrl]);

  // Group by cinema
  const groupedByCinema = suatChieus.reduce((acc, sc) => {
    const rapName = sc.phong?.rap?.tenRap || 'Rạp chiếu';
    const rapAddress = sc.phong?.rap?.diaChi || '';
    const key = rapName;

    if (!acc[key]) {
      acc[key] = { name: rapName, address: rapAddress, movies: {} };
    }

    const movieKey = sc.phim?.tenPhim || 'Phim';
    if (!acc[key].movies[movieKey]) {
      acc[key].movies[movieKey] = {
        title: movieKey,
        tag: sc.phim?.phanLoaiTuoi || '',
        tagStyle: sc.phim?.phanLoaiTuoi === 'P'
          ? 'bg-black/60 backdrop-blur-md border border-white/20'
          : 'bg-[#E50914]',
        times: [],
      };
    }

    acc[key].movies[movieKey].times.push({
      time: new Date(sc.thoiGianBatDau).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      id: sc.id,
      phong: sc.phong?.tenPhong || '',
      soGheTrong: sc.soGheTrong,
    });

    return acc;
  }, {});

  return (
    <>
      <Header />
      <main className="pt-28 pb-24 min-h-screen bg-surface">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="mb-10">
            <h2 className="font-headline text-4xl font-bold tracking-tight mb-2 text-on-surface">LỊCH CHIẾU PHIM</h2>
            <p className="text-secondary opacity-70">Chọn ngày để xem lịch chiếu chi tiết</p>
          </div>

          {/* Date Selector */}
          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-6 mb-8 border-b border-white/5">
            {dates.map((d, index) => (
              <button
                key={index}
                onClick={() => setSelectedDate(index)}
                className={`flex flex-col items-center justify-center min-w-[80px] py-3 rounded-xl transition-all ${
                  selectedDate === index
                    ? 'bg-[#E50914] text-white shadow-lg shadow-red-900/30'
                    : 'bg-surface-container-low text-secondary hover:bg-surface-container-high border border-white/5'
                }`}
              >
                <span className="text-xs font-bold uppercase mb-1">{d.day}</span>
                <span className="text-2xl font-black">{d.date}</span>
              </button>
            ))}
          </div>

          {/* Showtimes */}
          {loading ? (
            <div className="space-y-6">
              {[1,2,3].map((i) => (
                <div key={i} className="bg-surface-container-low rounded-2xl border border-white/5 overflow-hidden p-6">
                  <Skeleton className="h-6 w-48 mb-4" />
                  <Skeleton className="h-4 w-64 mb-6" />
                  <div className="flex gap-3">
                    {[1,2,3,4].map((j) => (
                      <Skeleton key={j} variant="rectangular" className="h-16 w-20 rounded-md" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : Object.keys(groupedByCinema).length === 0 ? (
            <div className="text-center text-secondary py-20">Không có suất chiếu cho ngày này</div>
          ) : (
            <div className="space-y-12">
              {Object.entries(groupedByCinema).map(([cinemaName, cinema]) => (
                <div key={cinemaName} className="bg-surface-container-low rounded-2xl border border-white/5 overflow-hidden">
                  <div className="bg-surface-container-high px-6 py-4 border-b border-white/5">
                    <h3 className="font-headline text-xl font-bold text-on-surface">{cinemaName}</h3>
                    <p className="text-xs text-secondary mt-1">{cinema.address}</p>
                  </div>

                  <div className="p-6 divide-y divide-white/5">
                    {Object.entries(cinema.movies).map(([movieTitle, movie]) => (
                      <div key={movieTitle} className="py-6 first:pt-0 last:pb-0">
                        <div className="flex items-center gap-3 mb-4">
                          {movie.tag && (
                            <span className={`px-2 py-0.5 text-[10px] font-black rounded ${movie.tagStyle} text-white`}>
                              {movie.tag}
                            </span>
                          )}
                          <h4 className="font-headline text-lg font-bold text-on-surface">{movieTitle}</h4>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          {movie.times.map((t, tIdx) => (
                            <Link
                              to={`/seats?suatChieuId=${t.id}`}
                              key={tIdx}
                              className="group relative bg-surface-container-highest border border-white/10 text-on-surface font-bold py-2 px-6 rounded-md hover:border-[#E50914] hover:text-[#E50914] transition-colors"
                            >
                              {t.time}
                              <span className="block text-[8px] font-normal text-secondary group-hover:text-[#E50914]/60">
                                {t.soGheTrong} ghế trống
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ShowtimesPage;