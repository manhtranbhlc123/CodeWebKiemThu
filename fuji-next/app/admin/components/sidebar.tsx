"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Package,
  Users,
  ShoppingCart,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  PackageOpen,
} from "lucide-react";
import { useAdmin } from "../providers";

export function AdminSidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useAdmin();

  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/admin" },
    { icon: PackageOpen, label: "Danh mục", href: "/admin/category" },
    { icon: Package, label: "Sản phẩm", href: "/admin/products" },
    { icon: Users, label: "Khách hàng", href: "/admin/customers" },
    { icon: ShoppingCart, label: "Đơn hàng", href: "/admin/orders" },
    { icon: FileText, label: "Tin tức", href: "/admin/news" }
  ];

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Mobile toggle button */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-white p-2 rounded-md shadow-md"
        onClick={toggleSidebar}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
        fixed top-0 left-0 z-40 h-screen transition-transform 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 w-64 bg-white shadow-md
      `}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-center h-16 border-b">
            <h1 className="text-xl font-bold text-[#269300]">
              Fuji Fruit Admin
            </h1>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center px-4 py-3 rounded-md transition-colors
                    ${
                      isActive
                        ? "bg-[#269300] text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }
                  `}
                >
                  <item.icon size={18} className="mr-3" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t">
            <Link
              href="/"
              className="flex items-center px-4 py-3 text-gray-700 rounded-md hover:bg-gray-100"
            >
              <LogOut size={18} className="mr-3" />
              <span>Quay lại trang chủ</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
