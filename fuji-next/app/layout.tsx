'use client';
import React, { useState, useEffect } from 'react'; // Thêm useState
import './globals.css';
import store from './store';
import { Provider } from 'react-redux';
import { checkAuthOnStart } from './store/slices/authSlice';
import { useAppDispatch } from './store';

function AuthChecker({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const [isAuthChecked, setIsAuthChecked] = useState(false); // Thêm state này

  useEffect(() => {
    dispatch(checkAuthOnStart()).finally(() => {
      setIsAuthChecked(true); // Đánh dấu đã kiểm tra xong
    });
  }, [dispatch]);

  // Nếu chưa kiểm tra xong, render ra cái gì đó "trắng" hoặc "loading" 
  // khớp hoàn toàn giữa Server và Client để tránh lỗi Hydration
  if (!isAuthChecked) {
    return <div className="min-h-screen bg-gray-100"></div>; 
  }

  return <>{children}</>;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body>
        <Provider store={store}>
          <AuthChecker>{children}</AuthChecker>
        </Provider>
      </body>
    </html>
  );
}