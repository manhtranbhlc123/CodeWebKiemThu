'use client';

import React, { useEffect, useState } from 'react';
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

import {
  fetchAllCategories,
  CategoryState,
} from '@/app/store/slices/categorySlice';

import { AppDispatch, RootState } from '@/app/store';
import { BaseURL } from '@/app/utils/baseUrl';
import { addToCart } from '@/app/store/slices/cartSlice';

const ProductsPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { fruits, pagination, loading: fruitLoading, error: fruitError } =
    useSelector<RootState, FruitState>((state) => state.fruit);

  const { categories, loading: categoryLoading, error: categoryError } =
    useSelector<RootState, CategoryState>((state) => state.category);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchAllFruits({ page: 0, size: 10 }));
    dispatch(fetchAllCategories({ page: 0, size: 10 }));
  }, [dispatch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchTerm.trim()) {
      dispatch(searchFruitsByName({ name: searchTerm, page: 0, size: 10 }));
      setSelectedCategory(null);
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
    dispatch(
      addToCart({
        fruitId: product.id,
        quantity: 1,
        fruitName: product.name,
        fruitCategory: product.categories,
        fruitPrice: product.price,
        image: product.image,
      })
    );
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.16),transparent_36%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.08),transparent_38%)]">
      <div className="container mx-auto px-4 py-10 lg:py-16">
        <section className="overflow-hidden rounded-[2rem] border border-white/40 bg-white/90 p-8 shadow-2xl shadow-slate-900/10 backdrop-blur-xl">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_0.85fr] lg:items-center">
            <div className="space-y-5">
              <p className="text-sm uppercase tracking-[0.32em] text-emerald-600">
                Hoa quả Fuji
              </p>
              <h1 className="text-4xl font-semibold text-slate-900 sm:text-5xl">
                Chọn trái cây tươi sạch - giao liền tay
              </h1>
            </div>

            <div className="relative overflow-hidden rounded-[1.75rem] bg-slate-100">
              <img
                src="/images/hero-banner.jpg"
                alt="Trái cây tươi"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>
      </div>

      <div className="container mx-auto px-4 py-8 lg:py-12">
        <form onSubmit={handleSearch} className="mb-8 grid gap-4 md:grid-cols-[1.3fr_0.7fr]">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm hoa quả..."
            className="w-full rounded-3xl border px-5 py-3"
          />
          <button className="rounded-3xl bg-emerald-600 px-5 py-3 text-white">
            Tìm kiếm
          </button>
        </form>

        {/* Categories */}
        <div className="mb-8 flex flex-wrap gap-3">
          <button
            onClick={() => handleCategorySelect(null)}
            className={`rounded-full px-5 py-2 ${
              selectedCategory === null ? 'bg-emerald-600 text-white' : 'bg-white'
            }`}
          >
            Tất cả
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              className={`rounded-full px-5 py-2 ${
                selectedCategory === category.id
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Loading */}
        {fruitLoading && <p>Loading...</p>}
        {fruitError && <p className="text-red-500">{fruitError}</p>}

        {/* Products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {fruits.map((product) => (
            <div key={product.id} className="rounded-xl border p-4">
              <img
                src={`${BaseURL.baseImage}${product.image}`}
                alt={product.name}
                className="h-40 w-full object-cover"
              />

              <h3 className="mt-2 font-semibold">{product.name}</h3>

              <p>{product.price.toLocaleString('vi-VN')}₫</p>

              <div className="flex justify-between mt-3">
                <Link href={`/fruits/${product.id}`}>Chi tiết</Link>

                <button
                  onClick={() => handleAddToCart(product)}
                  className="text-emerald-600"
                >
                  Thêm
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => handlePageChange(pagination.pageNumber - 1)}
              disabled={pagination.first}
            >
              Prev
            </button>

            <button
              onClick={() => handlePageChange(pagination.pageNumber + 1)}
              disabled={pagination.last}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;