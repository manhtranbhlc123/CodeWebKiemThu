'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import Link from 'next/link';
import {
  fetchAllFruits,
  searchFruitsByName,
  fetchFruitsByCategory,
  Fruit,
  FruitState,
} from '@/app/store/slices/fruitSlice';
import { fetchAllCategories, CategoryState } from '@/app/store/slices/categorySlice';
import { AppDispatch, RootState } from '@/app/store';
import { BaseURL } from '@/app/utils/baseUrl';
import { addToCart } from '@/app/store/slices/cartSlice';

const ProductsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { fruits, pagination, loading: fruitLoading, error: fruitError } = useSelector<
    RootState,
    FruitState
  >((state) => state.fruit);
  const { categories, loading: categoryLoading, error: categoryError } = useSelector<
    RootState,
    CategoryState
  >((state) => state.category);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchAllFruits({ page: 0, size: 10 }));
    dispatch(fetchAllCategories({ page: 0, size: 10 }));
  }, [dispatch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      dispatch(searchFruitsByName({ name: searchTerm, page: 0, size: 10 }));
      setSelectedCategory(null); // Reset danh mục khi tìm kiếm
    } else {
      dispatch(fetchAllFruits({ page: 0, size: 10 }));
    }
  };

  const handleCategorySelect = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    setSearchTerm('');
    if (categoryId) {
      dispatch(fetchFruitsByCategory({ categoryId, page: 0, size: 10 }));
    } else {
      dispatch(fetchAllFruits({ page: 0, size: 10 }));
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 0 || page >= pagination.totalPages) return;
    if (searchTerm.trim()) {
      dispatch(searchFruitsByName({ name: searchTerm, page, size: 10 }));
    } else if (selectedCategory) {
      dispatch(fetchFruitsByCategory({ categoryId: selectedCategory, page, size: 10 }));
    } else {
      dispatch(fetchAllFruits({ page, size: 10 }));
    }
  };

  const handleAddToCart = (product: Fruit) => {
    dispatch(addToCart({
      fruitId: product.id,
      quantity: 1,
      fruitName: product.name,
      fruitCategory: product.categories,
      fruitPrice: product.price,
      image: product.image,
    }));
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.16),transparent_36%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.08),transparent_38%)]">
      <div className="container mx-auto px-4 py-10 lg:py-16">
        <section className="overflow-hidden rounded-[2rem] border border-white/40 bg-white/90 p-8 shadow-2xl shadow-slate-900/10 backdrop-blur-xl">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_0.85fr] lg:items-center">
            <div className="space-y-5">
              <p className="text-sm uppercase tracking-[0.32em] text-emerald-600">Hoa quả Fuji</p>
              <h1 className="text-4xl font-semibold text-slate-900 sm:text-5xl">
                Chọn trái cây tươi sạch - giao liền tay
              </h1>
              <p className="max-w-2xl text-slate-600 sm:text-lg">
                Duyệt qua các sản phẩm ưu đãi, tìm theo danh mục và đặt hàng chỉ trong vài bước đơn giản.
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="inline-flex items-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-500">
                  Khám phá ngay
                </button>
                <button className="inline-flex items-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                  Xem danh mục
                </button>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-[1.75rem] bg-slate-100">
              <img
                src="/images/hero-banner.jpg"
                alt="Trái cây tươi"
                className="h-full w-full object-cover"
              />
              <div className="absolute right-5 top-5 rounded-3xl bg-emerald-600/95 px-5 py-3 text-sm font-semibold text-white shadow-xl shadow-emerald-600/20">
                Miễn phí giao hàng với đơn hàng đầu tiên
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="rounded-[2rem] border border-white/70 bg-white p-8 shadow-xl shadow-slate-900/5">
          <form onSubmit={handleSearch} className="mb-8 grid gap-4 md:grid-cols-[1.3fr_0.7fr]">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm hoa quả..."
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
            <button
              type="submit"
              className="rounded-3xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-500"
            >
              Tìm kiếm
            </button>
          </form>

          <div className="mb-8">
            <div className="flex flex-wrap gap-3 overflow-x-auto pb-3 scrollbar-hide">
              {categoryLoading && (
                <>
                  {Array(5).fill(0).map((_, i) => (
                    <div
                      key={i}
                      className="h-11 w-28 rounded-full bg-slate-200 animate-pulse"
                    ></div>
                  ))}
                </>
              )}
              {!categoryLoading && !categoryError && (
                <>
                  <button
                    onClick={() => handleCategorySelect(null)}
                    className={`h-11 rounded-full px-5 text-sm font-semibold transition ${selectedCategory === null
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                    aria-label="Hiển thị tất cả sản phẩm"
                  >
                    Tất cả
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category.id)}
                      className={`h-11 rounded-full px-5 text-sm font-semibold transition ${selectedCategory === category.id
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                        : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                      aria-label={`Hiển thị sản phẩm thuộc danh mục ${category.name}`}
                    >
                      {category.name}
                    </button>
                  ))}
                </>
              )}
            </div>
            {categoryError && (
              <div className="text-center text-red-500 text-lg">Lỗi danh mục: {categoryError}</div>
            )}
          </div>

        {/* Trạng thái tải và lỗi sản phẩm */}
        {fruitLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Array(10).fill(0).map((_, i) => (
              <div key={i} className="space-y-4 rounded-[1.5rem] bg-white p-5 shadow-lg shadow-slate-900/5 animate-pulse">
                <div className="h-52 rounded-3xl bg-slate-200" />
                <div className="h-4 rounded-full bg-slate-200" />
                <div className="h-4 w-3/4 rounded-full bg-slate-200" />
              </div>
            ))}
          </div>
        )}
        {fruitError && <div className="text-center text-red-500 text-lg">Lỗi: {fruitError}</div>}

        {/* Danh sách sản phẩm */}
        {!fruitLoading && !fruitError && fruits.length === 0 && (
          <div className="text-center text-green-700 text-lg">Không tìm thấy hoa quả nào.</div>
        )}
        {!fruitLoading && !fruitError && fruits.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {fruits.map((product: Fruit) => (
              <div
                key={product.id}
                className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/5 transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="relative mb-4 w-full overflow-hidden rounded-[1.5rem] bg-slate-100 h-[200px]">
                  <img
                    src={`${BaseURL.baseImage}${product.image}` || '/placeholder.svg'}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  {product.discount > 0 && (
                    <div className="absolute top-3 left-3 rounded-full bg-emerald-600/90 px-3 py-1 text-xs font-semibold text-white">
                      Giảm {product.discount * 100}%
                    </div>
                  )}
                </div>

                <h3 className="text-center text-base font-semibold text-slate-900 mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-center text-slate-600 mb-4 font-medium">
                  {product.discount > 0 ? (
                    <>
                      <span className="line-through mr-2 text-sm text-slate-400">
                        {product.price.toLocaleString('vi-VN')}₫
                      </span>
                      <span className="text-lg text-slate-900">
                        {(product.price * (1 - product.discount)).toLocaleString('vi-VN')}₫
                      </span>
                    </>
                  ) : (
                    <span className="text-lg text-slate-900">
                      {product.price.toLocaleString('vi-VN')}₫
                    </span>
                  )}
                </p>
                <div className="mt-auto flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={`/fruits/${product.id}`}
                    className="text-emerald-600 font-semibold hover:text-emerald-700 transition"
                  >
                    Xem chi tiết
                  </Link>
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stockStatus === 'OUT_OF_STOCK'}
                    className={`rounded-full px-4 py-2 text-sm font-semibold text-white transition ${product.stockStatus === 'OUT_OF_STOCK'
                      ? 'bg-slate-300 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-700'
                    }`}
                    aria-label={`Thêm ${product.name} vào giỏ hàng`}
                  >
                    Thêm vào giỏ
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Phân trang chỉ với icon Next và Back */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <nav className="inline-flex gap-2">
              <button
                onClick={() => handlePageChange(pagination.pageNumber - 1)}
                disabled={pagination.first}
                className="p-2 bg-white border border-green-300 rounded-full text-green-600 hover:bg-green-50 disabled:opacity-50"
                aria-label="Trang trước"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <button
                onClick={() => handlePageChange(pagination.pageNumber + 1)}
                disabled={pagination.last}
                className="p-2 bg-white border border-green-300 rounded-full text-green-600 hover:bg-green-50 disabled:opacity-50"
                aria-label="Trang tiếp theo"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Inline CSS để ẩn thanh cuộn */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  </div>
  );
};

export default ProductsPage;