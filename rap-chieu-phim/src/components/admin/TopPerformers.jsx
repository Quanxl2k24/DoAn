import React from 'react';

const TopPerformers = () => {
  return (
    <div className="bg-surface-container-low p-8 rounded-xl border border-white/5">
      <h2 className="font-headline text-xl font-bold tracking-tight mb-8">PHIM THỊNH HÀNH</h2>
      <div className="space-y-6">

        {/* Movie 1 */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-16 bg-surface rounded overflow-hidden flex-shrink-0">
            <img
              alt="Mắt Biếc"
              className="w-full h-full object-cover"
              src="/posterphim/matbiec.jpg"
            />
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm uppercase">MẮT BIẾC</p>
            <p className="text-xs text-gray-500">Doanh thu 42.3Tr</p>
          </div>
          <div className="text-tertiary text-xs font-bold">98%</div>
        </div>

        {/* Movie 2 */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-16 bg-surface rounded overflow-hidden flex-shrink-0">
            <img
              alt="Mai"
              className="w-full h-full object-cover"
              src="/posterphim/mai.jpg"
            />
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm uppercase">MAI</p>
            <p className="text-xs text-gray-500">Doanh thu 38.1Tr</p>
          </div>
          <div className="text-tertiary text-xs font-bold">94%</div>
        </div>

        {/* Movie 3 */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-16 bg-surface rounded overflow-hidden flex-shrink-0">
            <img
              alt="ĐÀO, PHỞ VÀ PIANO"
              className="w-full h-full object-cover"
              src="/posterphim/piano.jpg"
            />
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm uppercase">ĐÀO, PHỞ VÀ PIANO</p>
            <p className="text-xs text-gray-500">Doanh thu 29.5Tr</p>
          </div>
          <div className="text-tertiary text-xs font-bold">89%</div>
        </div>

      </div>
    </div>
  );
};

export default TopPerformers;