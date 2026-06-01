// app/access-denied/page.tsx
'use client';
import Link from 'next/link';

export default function AccessDenied() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <div className="bg-white p-8 rounded-lg shadow-lg border border-green-300 shadow-green-200 text-center max-w-md">
        <h1 className="text-3xl font-bold text-green-700 mb-4">
          Truy cập bị từ chối
        </h1>
        <p className="text-gray-600 mb-6">
          Bạn không có quyền truy cập vào khu vực admin. Vui lòng liên hệ quản trị viên nếu bạn cần hỗ trợ.
        </p>
        <Link href="/">
          <button className="px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-300">
            Trở về trang chủ
          </button>
        </Link>
      </div>
    </div>
  );
}