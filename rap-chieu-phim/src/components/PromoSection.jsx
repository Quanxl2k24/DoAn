import React from 'react';

const PromoSection = () => {
  return (
    <section className="px-6 md:px-16 py-10 max-w-[1920px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-auto md:h-[450px]">
        {/* Promo 1: ƯU ĐÃI THÀNH VIÊN */}
        <div className="md:col-span-2 relative rounded-3xl overflow-hidden group bg-surface-container-low border border-white/5">
          <img
            alt="Promo 1"
            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
            src="/posterphim/thanhvien.jpg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent p-10 flex flex-col justify-end">
            <h4 className="font-headline text-3xl font-bold mb-2">ƯU ĐÃI THÀNH VIÊN</h4>
            <p className="text-secondary mb-6">Tích điểm đổi quà, nhận vé miễn phí vào ngày sinh nhật của bạn.</p>
            <button className="bg-white text-black font-bold py-3 px-6 rounded-md w-fit text-sm">TÌM HIỂU THÊM</button>
          </div>
        </div>

        {/* Promo 2: COMBO TIẾT KIỆM */}
        <div className="relative rounded-3xl overflow-hidden group bg-surface-container-low border border-white/5">
          <img
            alt="Promo 2"
            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
            src="/posterphim/combo.jpg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent p-6 flex flex-col justify-end">
            <h4 className="font-headline text-xl font-bold mb-1">COMBO TIẾT KIỆM</h4>
            <p className="text-xs text-secondary mb-4">Giảm 20% khi mua kèm vé</p>
            <button className="bg-primary-container text-white text-xs font-bold py-2 px-4 rounded-md w-fit">MUA NGAY</button>
          </div>
        </div>

        {/* Promo 3: XEM PHIM CŨ (Đã thêm ảnh nền) */}
        <div className="relative rounded-3xl overflow-hidden group bg-surface-container-low border border-white/5">
          <img
            alt="Phim cũ"
            className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
            src="/posterphim/phimcu.jpg"
          />
          {/* Lớp phủ gradient để chữ dễ đọc hơn */}
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent p-8 h-full flex flex-col">
            <span className="material-symbols-outlined text-tertiary text-4xl mb-4">movie_edit</span>
            <h4 className="font-headline text-xl font-bold mb-2 text-white">XEM PHIM CŨ</h4>
            <p className="text-secondary text-sm mb-6">Trải nghiệm lại các tuyệt phẩm điện ảnh trên màn ảnh lớn.</p>
            <div className="mt-auto flex items-center text-tertiary font-bold gap-2 text-sm">
              Xem lịch chiếu <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoSection;