import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const TopPerformers = ({ days = 7 }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/admin/analytics/top-movies?days=${days}`);
        setMovies(res.data.data || []);
      } catch (err) {
        console.error('Lỗi tải top phim:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [days]);

  return (
    <div className="bg-surface-container-low p-8 rounded-xl border border-white/5">
      <h2 className="font-headline text-xl font-bold tracking-tight mb-8">PHIM THỊNH HÀNH</h2>
      {loading ? (
        <div className="text-center text-secondary py-10">Đang tải...</div>
      ) : movies.length === 0 ? (
        <div className="text-center text-secondary py-10">Chưa có dữ liệu</div>
      ) : (
        <div className="space-y-6">
          {movies.map((movie, idx) => (
            <div key={movie.phimId || idx} className="flex items-center gap-4">
              <div className="w-12 h-16 bg-surface rounded overflow-hidden flex-shrink-0">
                <img
                  alt={movie.tenPhim}
                  className="w-full h-full object-cover"
                  src={movie.posterUrl || '/posterphim/dune.jpg'}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm uppercase truncate">{movie.tenPhim}</p>
                <p className="text-xs text-gray-500">{movie.totalTickets} vé đã bán</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopPerformers;
