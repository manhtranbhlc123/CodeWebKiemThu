'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { fetchFruitById, fetchRelatedFruits, Fruit, FruitState } from '@/app/store/slices/fruitSlice';
import { addToCart } from '@/app/store/slices/cartSlice';
import { AppDispatch, RootState } from '@/app/store';
import { BaseURL } from '@/app/utils/baseUrl';
import Link from 'next/link';

// Hàm sinh màu nền ngẫu nhiên cho tags
const getRandomColor = () => {
  const colors = [
    'bg-green-200 text-green-800',
    'bg-lime-200 text-lime-800',
    'bg-emerald-200 text-emerald-800',
    'bg-teal-200 text-teal-800',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const ProductDetailPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();
  const { selectedFruit, relatedFruits, loading, error } = useSelector<RootState, FruitState>(
    (state) => state.fruit
  );
  const cartLoading = useSelector<RootState, boolean>((state) => state.cart.loading);

  useEffect(() => {
    if (id && !isNaN(Number(id))) {
      dispatch(fetchFruitById(Number(id)));
      console.log(selectedFruit);
      dispatch(fetchRelatedFruits({
        fruitId: Number(id),
      }));

    }
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (selectedFruit) {
      dispatch(addToCart({
        fruitId: selectedFruit.id,
        quantity: 1,
        fruitName: selectedFruit.name,
        fruitCategory: selectedFruit.categories,
        fruitPrice: selectedFruit.price,
        image: selectedFruit.image,
      }));
    }
  };

  if (loading) return <div className="text-center py-20 text-emerald-700 text-lg">Đang tải...</div>;
  if (error) return <div className="text-center py-20 text-red-600 text-lg">Lỗi: {error}</div>;
  if (!selectedFruit) return <div className="text-center py-20 text-emerald-700 text-lg">Không tìm thấy sản phẩm</div>;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.16),transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(15,118,110,0.08),transparent_40%)] py-16">
      <div className="container mx-auto px-4">
        <div className="rounded-[2rem] border border-white/40 bg-white/95 p-8 shadow-2xl shadow-slate-900/10 backdrop-blur-xl">
          <div className="grid gap-8 lg:grid-cols-[1.6fr_0.9fr]">
            <div className="space-y-6">
              <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] bg-slate-50 rounded-[1.75rem] p-6 shadow-inner shadow-slate-900/5">
                <div className="relative w-full h-[320px] rounded-[1.5rem] overflow-hidden bg-slate-100">
                  <Image
                    src={`${BaseURL.baseImage}${selectedFruit.image}` || '/placeholder.svg'}
                    alt={selectedFruit.name}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    priority
                  />
                  {selectedFruit.discount > 0 && (
                    <div className="absolute top-4 left-4 rounded-full bg-emerald-600/90 px-3 py-1 text-xs font-semibold text-white shadow-lg shadow-emerald-600/20">
                      Giảm {selectedFruit.discount * 100}%
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-5">
                  <div className="space-y-4">
                    <h1 className="text-3xl font-bold text-slate-900">{selectedFruit.name}</h1>
                    <div className="flex flex-wrap items-center gap-2">
                      {Array.from({ length: Math.round(selectedFruit.averageRating) }).map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-yellow-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <div className="text-2xl font-semibold text-slate-900">
                      {selectedFruit.discount > 0 ? (
                        <>
                          <span className="line-through text-slate-400 mr-2">{selectedFruit.price.toLocaleString('vi-VN')}₫</span>
                          <span className="text-emerald-600">
                            {(selectedFruit.price * (1 - selectedFruit.discount)).toLocaleString('vi-VN')}₫
                          </span>
                        </>
                      ) : (
                        <span>{selectedFruit.price.toLocaleString('vi-VN')}₫</span>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-3 text-sm text-slate-600">
                    <p>
                      <span className="font-semibold text-slate-900">Danh mục:</span> {selectedFruit.categories.map((cat) => cat.name).join(', ')}
                    </p>
                    <p className="flex flex-wrap gap-2">
                      {selectedFruit.tags.map((tag, index) => (
                        <span key={index} className={`rounded-full px-3 py-1 text-xs font-semibold ${getRandomColor()}`}>
                          {tag}
                        </span>
                      ))}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-900">Nguồn gốc:</span> {selectedFruit.origin}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-900">Trọng lượng:</span> {selectedFruit.weight} kg
                    </p>
                    <p>
                      <span className="font-semibold text-slate-900">Trạng thái kho:</span>{' '}
                      <span className={
                        selectedFruit.stockStatus === 'LOW_STOCK'
                          ? 'text-amber-500 font-semibold'
                          : selectedFruit.stockStatus === 'OUT_OF_STOCK'
                            ? 'text-rose-500 font-semibold'
                            : 'text-emerald-600 font-semibold'
                      }>
                        {selectedFruit.stockStatus === 'IN_STOCK'
                          ? 'Còn hàng'
                          : selectedFruit.stockStatus === 'LOW_STOCK'
                            ? 'Sắp hết hàng'
                            : 'Hết hàng'}
                      </span>
                    </p>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={selectedFruit.stockStatus === 'OUT_OF_STOCK' || cartLoading}
                    className={`mt-4 inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white transition ${selectedFruit.stockStatus === 'OUT_OF_STOCK' || cartLoading ? 'bg-slate-300 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                    aria-label="Thêm sản phẩm vào giỏ hàng"
                  >
                    {cartLoading ? 'Đang xử lý...' : 'Thêm vào giỏ hàng'}
                  </button>
                </div>
              </div>

              <div className="rounded-[1.75rem] bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Mô tả sản phẩm</h2>
                <p className="text-slate-600 leading-relaxed text-sm">{selectedFruit.description}</p>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-xl">
                <h2 className="text-lg font-semibold text-emerald-700 mb-4">Sản phẩm tương tự</h2>
                <div className="flex flex-col gap-4">
                  {relatedFruits.length > 0 ? (
                    relatedFruits.slice(0, 4).map((fruit: Fruit) => (
                      <Link key={fruit.id} href={`/fruits/${fruit.id}`} className="flex gap-3 items-center rounded-3xl border border-slate-200 p-3 transition hover:border-emerald-200 hover:bg-slate-50">
                        <div className="relative w-16 h-16 overflow-hidden rounded-2xl">
                          <Image
                            src={`${BaseURL.baseImage}${fruit.image}` || '/placeholder.svg'}
                            alt={fruit.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-slate-900">{fruit.name}</h3>
                          <p className="text-xs text-slate-600">{fruit.price.toLocaleString('vi-VN')}₫</p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-slate-600">Không có sản phẩm gợi ý</p>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;