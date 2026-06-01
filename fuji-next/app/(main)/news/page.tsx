'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppDispatch, RootState } from '@/app/store';
import { fetchNews, fetchCategories, setCurrentPage, NewsState } from '@/app/store/slices/newsSlice';
import { BaseURL } from '@/app/utils/baseUrl';

export default function NewsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { newsItems, categories, totalPages, currentPage, loading, error } = useSelector<RootState, NewsState>(
    (state) => state.new
  );
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchNews({ page: currentPage, categoryId: selectedCategory ? selectedCategory : undefined }));
  }, [dispatch, currentPage, selectedCategory]);

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (categoryName: string, index: number) => {
    if (categoryName === 'Tất cả') {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(index);
    }
    dispatch(setCurrentPage(1));
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.12),transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(15,118,110,0.08),transparent_40%)] py-16">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <section className="mb-10 overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-2xl shadow-slate-900/10 backdrop-blur-xl">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_0.7fr] lg:items-center">
            <div className="space-y-5">
              <p className="uppercase tracking-[0.32em] text-emerald-600 text-sm">Tin tức Fuji</p>
              <h1 className="text-4xl font-semibold text-slate-900 sm:text-5xl">
                Cập nhật xu hướng và mẹo chọn trái cây tươi
              </h1>
              <p className="max-w-2xl text-slate-600 sm:text-lg">
                Đọc những bài viết mới nhất về chất lượng, dinh dưỡng và ưu đãi đặc biệt từ Fuji Fresh.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/news" className="inline-flex items-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-500">
                  Tin mới nhất
                </Link>
                <Link href="/fruits" className="inline-flex items-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                  Khám phá sản phẩm
                </Link>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-[1.75rem] bg-slate-100 h-72">
              <img
                src="/images/hero-banner.jpg"
                alt="Tin tức Fuji"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>

        {loading && (
          <div className="flex justify-center items-center py-16">
            <svg className="animate-spin h-10 w-10 text-green-600 mr-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <span className="text-lg text-gray-600">Đang tải...</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {newsItems.length > 0 ? (
              newsItems.map((item) => (
                <div
                  key={item.id}
                  className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-xl shadow-slate-900/5 transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="relative md:w-80 h-64 md:h-auto overflow-hidden">
                      <Image
                        src={item.image ? `${BaseURL.baseImage}/images/${item.image}` : '/placeholder.svg?height=200&width=400'}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105 rounded-t-2xl md:rounded-l-2xl md:rounded-t-none"
                      />
                    </div>
                    <div className="p-6 flex-1">
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <Calendar size={16} className="mr-2 text-green-600" />
                          <span>{new Date(item.date).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <div className="flex items-center">
                          <Tag size={16} className="mr-2 text-green-600" />
                          <span>{item.category}</span>
                        </div>
                      </div>
                      <Link href={`/news/${item.slug}`}>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors duration-300">
                          {item.title}
                        </h2>
                      </Link>
                      <p className="text-gray-600 mb-5 line-clamp-2">{item.excerpt}</p>
                      <Link
                        href={`/news/${item.slug}`}
                        className="inline-block bg-green-100 text-green-700 font-semibold px-5 py-2 rounded-full hover:bg-green-200 transition-all duration-300"
                      >
                        Đọc Thêm
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              !loading && (
                <div className="bg-white rounded-2xl shadow-md p-8 text-center">
                  <p className="text-gray-500 text-lg">Không tìm thấy tin tức nào.</p>
                </div>
              )
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <nav className="flex items-center space-x-2" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1 || loading}
                    className="p-3 rounded-full bg-white text-green-600 hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    aria-label="Trang trước"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      disabled={loading}
                      className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                        currentPage === i + 1
                          ? 'bg-green-600 text-white'
                          : 'bg-white text-green-600 hover:bg-green-100'
                      } disabled:opacity-50`}
                      aria-label={`Trang ${i + 1}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages || loading}
                    className="p-3 rounded-full bg-white text-green-600 hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    aria-label="Trang sau"
                  >
                    <ChevronRight size={24} />
                  </button>
                </nav>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Categories */}
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-xl transition-all duration-300 hover:shadow-2xl">
              <h3 className="text-xl font-bold text-emerald-700 mb-4">Danh Mục Tin Tức</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => handleCategoryChange('Tất cả', -1)}
                    className={`w-full text-left py-3 px-4 rounded-lg transition-all duration-300 ${
                      selectedCategory === null
                        ? 'bg-green-100 text-green-700 font-semibold'
                        : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                    } flex justify-between items-center`}
                    aria-label="Lọc theo danh mục tất cả"
                  >
                    <span>Tất cả</span>
                    <span className="bg-green-200 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                      {categories.length}
                    </span>
                  </button>
                </li>
             
                {categories.map((category, index) => (
                  <li key={index}>
                    <button
                      onClick={() => handleCategoryChange(category.name, index )}
                      className={`w-full text-left py-3 px-4 rounded-lg transition-all duration-300 ${
                        selectedCategory === (category.name === 'Tất cả' ? null : index)
                          ? 'bg-green-100 text-green-700 font-semibold'
                          : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                      } flex justify-between items-center`}
                      aria-label={`Lọc theo danh mục ${category.name}`}
                    >
                      <span>{category.name}</span>
                      <span className="bg-green-200 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recent Posts */}
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-xl transition-all duration-300 hover:shadow-2xl">
              <h3 className="text-xl font-bold text-emerald-700 mb-4">Bài Viết Gần Đây</h3>
              <ul className="space-y-4">
                {newsItems.slice(0, 3).map((item) => (
                  <li key={item.id} className="flex space-x-4 group">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                      <Image
                        src={item.image ? `${BaseURL.baseImage}/images/${item.image}` : '/placeholder.svg?height=200&width=400'}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <div className="flex-1">
                      <Link href={`/news/${item.slug}`}>
                        <h4 className="text-sm font-semibold text-gray-900 group-hover:text-green-600 transition-colors duration-300">
                          {item.title}
                        </h4>
                      </Link>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(item.date).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Commitments */}
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-xl transition-all duration-300 hover:shadow-2xl">
              <h3 className="text-xl font-bold text-emerald-700 mb-4">Cam Kết Của Chúng Tôi</h3>
              <ul className="space-y-4">
                {[
                  { text: '100% trái cây tươi ngon', icon: 'M5 13l4 4L19 7' },
                  { text: 'Giao hàng nhanh chóng', icon: 'M5 13l4 4L19 7' },
                  { text: 'Đổi trả trong 24h', icon: 'M5 13l4 4L19 7' },
                ].map((commitment, index) => (
                  <li key={index} className="flex items-center group">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3 transition-transform duration-300 group-hover:scale-110">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={commitment.icon} />
                      </svg>
                    </div>
                    <span className="text-gray-700 font-medium group-hover:text-green-600 transition-colors duration-300">
                      {commitment.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}