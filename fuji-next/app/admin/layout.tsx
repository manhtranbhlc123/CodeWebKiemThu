'use client';
import React from "react";
import { useRouter } from "next/navigation";
import { RootState } from "../store";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, role } = useSelector((state: RootState) => state.auth);
  const testt=true;
  const router = useRouter();
  const [showMessage, setShowMessage] = useState(false);

  console.log(isAuthenticated);
  console.log(role);

  if (!testt) {
    useEffect(() => {
      const timer = setTimeout(() => {
        setShowMessage(true);
        setTimeout(() => {
          router.push("/login");
        }, 1000);
      }, 10000);

      return () => clearTimeout(timer);
    }, [router]);

    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        {showMessage ? (
          <div className="text-2xl font-semibold text-red-600">
            Bạn chưa đăng nhập. Vui lý đăng nhập trên trang chủ.
          </div>
        ) : (
          <div className="w-16 h-16 border-4 border-t-4 border-green-500 border-solid rounded-full animate-spin"></div>
        )}
      </div>
    );
  }

  if (role !== "ROLE_ADMIN") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="mb-4 text-3xl font-bold text-red-600">Không có quyền truy cập</h1>
        <p className="mb-6 text-lg text-gray-600">Bạn không có quyền truy cập vào page này.</p>
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 text-white transition bg-green-500 rounded hover:bg-green-600"
        >
          Trở về trang chủ
        </button>
      </div>
    );
  }

  return <>{children}</>;
}