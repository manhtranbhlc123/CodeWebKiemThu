'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Search, Menu, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../store';
import { useEffect, useState } from 'react';
import { logout } from '../store/slices/authSlice';
import { fetchCart } from '../store/slices/cartSlice';

export default function Header({ initialAuth }: { initialAuth: boolean }) {
  const dispatch = useAppDispatch();
  const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated) ?? initialAuth;
  const cartItemCount = useSelector((state: RootState) => state.cart.cartLength ?? 0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isAuth) {
      dispatch(fetchCart());
    }
  }, [isAuth, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#269300] text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Image
            src="/images/user.png"
            alt="Fuji Fruit Logo"
            width={36}
            height={36}
            className="rounded-full border-2 border-white"
          />
          <span className="text-sm font-medium hidden md:block">
            Hoa quả sạch Fuji: 1900 2268
          </span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <nav className="flex gap-2">
            <Link
              href="/"
              className="px-4 py-2 text-white font-medium hover:bg-green-100 hover:text-[#269300] rounded-full transition-colors"
            >
              Trang chủ
            </Link>
            <Link
              href="/fruits"
              className="px-4 py-2 text-white font-medium hover:bg-green-100 hover:text-[#269300] rounded-full transition-colors"
            >
              Sản phẩm
            </Link>
            <Link
              href="/news"
              className="px-4 py-2 text-white font-medium hover:bg-green-100 hover:text-[#269300] rounded-full transition-colors"
            >
              Tin tức
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            {isAuth ? (
              <>
                <Link
                  href="/cart"
                  className="relative text-sm font-medium hover:bg-green-100 hover:text-[#269300] rounded-full transition-colors flex items-center px-4 py-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Giỏ hàng
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                </Link>
                <Link
                  href="/profile"
                  className="text-sm font-medium hover:bg-green-100 hover:text-[#269300] rounded-full transition-colors px-4 py-2"
                >
                  Hồ sơ
                </Link>
                <Link
                  href="/login"
                  onClick={handleLogout}
                  className="text-sm font-medium hover:bg-green-100 hover:text-[#269300] rounded-full transition-colors px-4 py-2"
                >
                  Đăng xuất
                </Link>
              </>
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium hover:bg-green-100 hover:text-[#269300] rounded-full transition-colors px-4 py-2"
              >
                Đăng nhập
              </Link>
            )}
            <Link
              href="/admin"
              className="text-sm font-medium hover:bg-green-100 hover:text-[#269300] rounded-full transition-colors flex items-center px-4 py-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Admin
            </Link>
          </div>
          <button className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`bg-[#269300] md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="container mx-auto px-4 py-3">
          <nav className="flex flex-col space-y-2">
            <Link
              href="/"
              className="px-4 py-2 text-white font-medium hover:bg-green-100 hover:text-[#269300] rounded-full transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Trang chủ
            </Link>
            <Link
              href="/fruits"
              className="px-4 py-2 text-white font-medium hover:bg-green-100 hover:text-[#269300] rounded-full transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Sản phẩm
            </Link>
            <Link
              href="/news"
              className="px-4 py-2 text-white font-medium hover:bg-green-100 hover:text-[#269300] rounded-full transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Tin tức
            </Link>
            {isAuth ? (
              <>
                <Link
                  href="/cart"
                  className="relative px-4 py-2 text-white font-medium hover:bg-green-100 hover:text-[#269300] rounded-full transition-colors flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Giỏ hàng
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                </Link>
                <Link
                  href="/profile"
                  className="px-4 py-2 text-white font-medium hover:bg-green-100 hover:text-[#269300] rounded-full transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Hồ sơ
                </Link>
                <Link
                  href="/login"
                  onClick={handleLogout}
                  className="px-4 py-2 text-white font-medium hover:bg-green-100 hover:text-[#269300] rounded-full transition-colors"
                >
                  Đăng xuất
                </Link>
              </>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 text-white font-medium hover:bg-green-100 hover:text-[#269300] rounded-full transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Đăng nhập
              </Link>
            )}
            <Link
              href="/admin"
              className="px-4 py-2 text-white font-medium hover:bg-green-100 hover:text-[#269300] rounded-full transition-colors flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Admin
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}