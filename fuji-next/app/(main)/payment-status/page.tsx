'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';

const PaymentStatusPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed' | 'error'>('loading');
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const vnpTxnRef = searchParams.get('vnp_TxnRef');
    const statusParam = searchParams.get('status');
    const orderIdParam = searchParams.get('orderId');
    const message = searchParams.get('message');

    if (!vnpTxnRef || !statusParam || !orderIdParam) {
      setStatus('error');
      toast.error('Không tìm thấy thông tin giao dịch');
      return;
    }

    setOrderId(orderIdParam);
    if (statusParam === 'completed') {
      setStatus('success');
      toast.success('Thanh toán thành công: ' + decodeURIComponent(message || ''));
      setTimeout(() => router.push(`/orders/${orderIdParam}`), 3000);
    } else {
      setStatus('failed');
      toast.error('Thanh toán thất bại: ' + decodeURIComponent(message || ''));
    }
  }, [searchParams, router]);

  return (
    <div className="py-8 bg-gray-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6 text-[#269300]">Trạng thái thanh toán</h1>
        <div className="bg-white rounded-lg shadow overflow-hidden p-6 text-center">
          {status === 'loading' && (
            <p className="text-gray-600">Đang kiểm tra trạng thái thanh toán...</p>
          )}
          {status === 'success' && (
            <>
              <p className="text-green-600 font-semibold">Thanh toán thành công!</p>
              <p className="text-gray-600 mt-2">
                Đơn hàng #{orderId} đã được xác nhận. Bạn sẽ được chuyển đến trang chi tiết đơn hàng.
              </p>
              <Link
                href={`/orders/${orderId}`}
                className="mt-4 inline-block bg-[#269300] text-white px-4 py-2 rounded-md hover:bg-[#1e7a00]"
              >
                Xem chi tiết đơn hàng
              </Link>
            </>
          )}
          {status === 'failed' && (
            <>
              <p className="text-red-600 font-semibold">Thanh toán thất bại</p>
              <p className="text-gray-600 mt-2">
                Đơn hàng #{orderId} chưa được thanh toán. Vui lòng thử lại.
              </p>
              <Link
                href="/cart"
                className="mt-4 inline-block bg-[#269300] text-white px-4 py-2 rounded-md hover:bg-[#1e7a00]"
              >
                Quay lại giỏ hàng
              </Link>
            </>
          )}
          {status === 'error' && (
            <>
              <p className="text-red-600 font-semibold">Có lỗi xảy ra</p>
              <p className="text-gray-600 mt-2">Không thể xác minh trạng thái thanh toán.</p>
              <Link
                href="/cart"
                className="mt-4 inline-block bg-[#269300] text-white px-4 py-2 rounded-md hover:bg-[#1e7a00]"
              >
                Quay lại giỏ hàng
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentStatusPage;