'use client';
import type React from 'react';
import './globals.css';
import store from './store';
import { Provider } from 'react-redux';
import { useEffect } from 'react';
import { checkAuthOnStart } from './store/slices/authSlice';
import { useAppDispatch } from './store';

function AuthChecker({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkAuthOnStart());
  }, [dispatch]);

  return <>{children}</>;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <Provider store={store}>
          <AuthChecker>{children}</AuthChecker>
        </Provider>
      </body>
    </html>
  );
}