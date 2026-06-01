"use client"

import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <h3 className="text-xl font-semibold text-emerald-300 mb-4">Fuji Fruit</h3>
            <p className="text-slate-300 leading-relaxed">
              Chuyên cung cấp các loại trái cây nhập khẩu chất lượng cao, đảm bảo tươi ngon và an toàn cho sức khỏe.
            </p>
            <div className="mt-5 flex items-center gap-3 text-slate-300">
              <a href="#" className="transition hover:text-white">
                <Facebook size={22} />
              </a>
              <a href="#" className="transition hover:text-white">
                <Instagram size={22} />
              </a>
              <a href="#" className="transition hover:text-white">
                <Twitter size={22} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-emerald-300 mb-4">Liên kết nhanh</h3>
            <ul className="space-y-3 text-slate-300">
              <li>
                <Link href="/" className="transition hover:text-white">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/fruits" className="transition hover:text-white">
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link href="/news" className="transition hover:text-white">
                  Tin tức
                </Link>
              </li>
              <li>
                <Link href="/gioi-thieu" className="transition hover:text-white">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link href="/lien-he" className="transition hover:text-white">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-emerald-300 mb-4">Danh mục sản phẩm</h3>
            <ul className="space-y-3 text-slate-300">
              <li>
                <Link href="/san-pham?category=trai-cay-nhap-khau" className="transition hover:text-white">
                  Trái cây nhập khẩu
                </Link>
              </li>
              <li>
                <Link href="/san-pham?category=trai-cay-viet-nam" className="transition hover:text-white">
                  Trái cây Việt Nam
                </Link>
              </li>
              <li>
                <Link href="/san-pham?category=trai-cay-theo-mua" className="transition hover:text-white">
                  Trái cây theo mùa
                </Link>
              </li>
              <li>
                <Link href="/san-pham?category=qua-tang" className="transition hover:text-white">
                  Giỏ quà tặng
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-emerald-300 mb-4">Liên hệ</h3>
            <ul className="space-y-4 text-slate-300">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-emerald-300 mt-1" />
                <span>123 Đường Trái Cây, Quận 1, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-emerald-300" />
                <span>0123 456 789</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-emerald-300" />
                <span>info@fujifruit.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 text-center text-sm text-slate-400">
          <p>© {new Date().getFullYear()} Fuji Fruit. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  )
}

