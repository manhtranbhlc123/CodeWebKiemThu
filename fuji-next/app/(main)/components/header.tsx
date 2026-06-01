'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, User, Menu, X, ChevronDown } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '@/app/store/slices/authSlice'
import { RootState } from '@/app/store'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen)
  }

  const handleLogout = () => {
    dispatch(logout())
    setIsUserMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-200/40">
              F
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.18em] uppercase text-emerald-700">Fuji Fruit</p>
              <p className="text-xs text-slate-500">Trái cây tươi mỗi ngày</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-700">
            <Link href="/" className="transition hover:text-emerald-700">Trang chủ</Link>
            <Link href="/fruits" className="transition hover:text-emerald-700">Sản phẩm</Link>
            <Link href="/news" className="transition hover:text-emerald-700">Tin tức</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/cart" className="relative rounded-full border border-emerald-100 bg-white p-2 text-emerald-700 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50">
              <ShoppingCart size={20} />
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button onClick={toggleUserMenu} className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-slate-700 shadow-sm transition hover:border-emerald-200">
                  <User size={18} />
                  <ChevronDown size={14} />
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-3xl border border-slate-200 bg-white p-2 shadow-lg">
                    <Link href="/profile" className="block rounded-2xl px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50" onClick={() => setIsUserMenuOpen(false)}>
                      Profile người dùng
                    </Link>
                    <Link href="/change-password" className="block rounded-2xl px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50" onClick={() => setIsUserMenuOpen(false)}>
                      Đổi mật khẩu
                    </Link>
                    <button className="block w-full rounded-2xl px-4 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50" onClick={handleLogout}>
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="rounded-full border border-emerald-100 bg-white px-3 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50">
                Đăng nhập
              </Link>
            )}

            <button className="md:hidden text-slate-700" onClick={toggleMenu}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4">
            <nav className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <Link href="/" className="text-slate-700 transition hover:text-emerald-700" onClick={() => setIsMenuOpen(false)}>
                Trang chủ
              </Link>
              <Link href="/fruits" className="text-slate-700 transition hover:text-emerald-700" onClick={() => setIsMenuOpen(false)}>
                Sản phẩm
              </Link>
              <Link href="/news" className="text-slate-700 transition hover:text-emerald-700" onClick={() => setIsMenuOpen(false)}>
                Tin tức
              </Link>
              <Link href="/admin" className="text-slate-700 transition hover:text-emerald-700" onClick={() => setIsMenuOpen(false)}>
                Admin
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
