import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../utils/api';
import toast from 'react-hot-toast';

const PaymentPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const suatChieuId = searchParams.get('suatChieuId');
  const gheIds = searchParams.get('gheIds')?.split(',') || [];
  const total = Number(searchParams.get('total')) || 0;

  const [paymentMethod, setPaymentMethod] = useState('MOMO');
  const [submitting, setSubmitting] = useState(false);

  const handlePayment = async () => {
    if (!suatChieuId || gheIds.length === 0) {
      toast.error('Thiếu thông tin đặt vé');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/dat-ve', {
        suatChieuId,
        gheIds,
        phuongThuc: paymentMethod,
      });
      toast.success('Đặt vé thành công!');
      navigate('/history');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Thanh toán thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const paymentMethods = [
    { id: 'MOMO', name: 'Ví MoMo', icon: 'account_balance_wallet' },
    { id: 'ZALOPAY', name: 'ZaloPay', icon: 'account_balance_wallet' },
    { id: 'CARD', name: 'Thẻ tín dụng / Ghi nợ', icon: 'credit_card' },
    { id: 'ATM', name: 'Thẻ ATM nội địa', icon: 'payments' },
  ];

  return (
    <>
      <Header />
      <main className="pt-28 pb-24 min-h-screen bg-surface">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left: Payment Methods */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h3 className="font-headline text-2xl font-bold tracking-tight mb-6 text-on-surface">
                PHƯƠNG THỨC THANH TOÁN
              </h3>
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center gap-4 p-5 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === method.id
                        ? 'bg-surface-container-high border-[#E50914]'
                        : 'bg-surface-container-low border-white/5 hover:bg-surface-container-high'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                      className="hidden"
                    />
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === method.id ? 'border-[#E50914]' : 'border-secondary'
                      }`}
                    >
                      {paymentMethod === method.id && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#E50914]"></div>
                      )}
                    </div>
                    <span className="material-symbols-outlined text-secondary">{method.icon}</span>
                    <span className="font-bold text-on-surface">{method.name}</span>
                  </label>
                ))}
              </div>
            </section>
          </div>

          {/* Right: Order Summary */}
          <div>
            <div className="bg-surface-container-low rounded-3xl p-8 border border-white/5 sticky top-28">
              <h3 className="font-headline text-xl font-bold mb-6 text-on-surface border-b border-white/5 pb-4">
                TÓM TẮT ĐƠN HÀNG
              </h3>

              <div className="space-y-4 text-sm mb-6 border-b border-white/5 pb-6">
                <li className="flex justify-between">
                  <span className="text-secondary">Ghế</span>
                  <span className="font-bold text-on-surface">{gheIds.length} ghế</span>
                </li>
              </div>

              <div className="space-y-4 text-sm mb-8">
                <li className="flex justify-between items-center">
                  <span className="text-secondary">Tạm tính</span>
                  <span className="font-bold text-on-surface">{total.toLocaleString('vi-VN')}đ</span>
                </li>
                <li className="flex justify-between items-center pt-4 border-t border-white/5">
                  <span className="text-lg font-bold text-on-surface">Tổng cộng</span>
                  <span className="font-black text-3xl text-[#E50914]">
                    {total.toLocaleString('vi-VN')}đ
                  </span>
                </li>
              </div>

              <button
                onClick={handlePayment}
                disabled={submitting}
                className="w-full text-center bg-[#E50914] text-white font-bold py-4 rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-900/30 disabled:opacity-50"
              >
                {submitting ? 'ĐANG XỬ LÝ...' : 'THANH TOÁN'}
              </button>

              <p className="text-center text-[10px] text-secondary mt-4 px-4">
                Bằng việc bấm "Thanh toán", bạn đã đồng ý với các điều khoản sử dụng của Cine Première.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PaymentPage;