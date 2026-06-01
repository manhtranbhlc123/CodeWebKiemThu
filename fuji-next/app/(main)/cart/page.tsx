"use client";

import { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  fetchCart,
  plusCartItem,
  minusCartItem,
  removeCartItem,
  checkoutCart,
  clearCart,
  CartState,
} from "@/app/store/slices/cartSlice";
import { AppDispatch, RootState } from "@/app/store";
import { BaseURL } from "@/app/utils/baseUrl";

const CartItem: React.FC<{
  item: {
    id: number;
    fruitId: number;
    fruitName: string;
    fruitPrice: number;
    fruitDiscount: number;
    quantity: number;
    image: string;
    fruitCategory: string;
  };
  loading: boolean;
  onPlus: (fruitId: number) => void;
  onMinus: (fruitId: number) => void;
  onRemove: (fruitId: number) => void;
  formatPrice: (price: number) => string;
}> = ({ item, loading, onPlus, onMinus, onRemove, formatPrice }) => {
  const discountedPrice =
    item.fruitDiscount > 0
      ? item.fruitPrice * (1 - item.fruitDiscount)
      : item.fruitPrice;
  const totalPrice = discountedPrice * item.quantity;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-center p-4 border-b hover:bg-gray-50 transition-colors duration-300 hover:shadow hover:bg-gray-100">
      {/* Image */}
      <div className="sm:col-span-1">
        <Image
          src={`${BaseURL.baseImage}${item.image}` || "/placeholder.svg"}
          alt={item.fruitName}
          width={80}
          height={80}
          className="rounded-md object-cover"
        />
      </div>

      {/* Info */}
      <div className="sm:col-span-2 space-y-1">
        <h3 className="font-semibold text-gray-900 text-lg">{item.fruitName}</h3>
        <p className="text-sm text-gray-600">{item.fruitCategory}</p>
        <div className="flex items-center space-x-2 mt-2">
          <button
            className="p-2 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => onMinus(item.fruitId)}
            disabled={loading || item.quantity <= 1}
          >
            <Minus size={16} />
          </button>
          <span className="px-3 text-gray-900 font-medium">{item.quantity}</span>
          <button
            className="p-2 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => onPlus(item.fruitId)}
            disabled={loading}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="sm:col-span-1 text-right space-y-1">
        {item.fruitDiscount > 0 ? (
          <>
            <p className="text-sm text-gray-500 line-through">
              {formatPrice(item.fruitPrice * item.quantity)}
            </p>
            <p className="font-bold text-[#269300] text-lg">
              {formatPrice(totalPrice)}
            </p>
          </>
        ) : (
          <p className="font-bold text-[#269300] text-lg">
            {formatPrice(totalPrice)}
          </p>
        )}
      </div>

      <div className="sm:col-span-1 text-right space-y-1 flex justify-end">
        <button
          className="text-red-500 flex items-center text-sm hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => onRemove(item.fruitId)}
          disabled={loading}
        >
          <Trash2 size={20} className="mr-1" />
        </button>
      </div>
    </div>
  );
};

const OrderSummary: React.FC<{
  subtotal: number;
  total: number;
  loading: boolean;
  onCheckout: () => void;
  formatPrice: (price: number) => string;
  isCartEmpty: boolean;
}> = ({ subtotal, total, loading, onCheckout, formatPrice, isCartEmpty }) => (
  <div className="bg-white rounded-lg shadow-lg p-6">
    <h2 className="text-xl font-bold text-gray-900 mb-4">Tổng quan đơn hàng</h2>
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-gray-600">Tạm tính:</span>
        <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
      </div>
      <div className="border-t pt-3 flex justify-between font-semibold">
        <span className="text-gray-800">Tổng cộng:</span>
        <span className="text-[#269300] text-lg">{formatPrice(total)}</span>
      </div>
    </div>
    <button
      className="w-full bg-[#269300] text-white py-3 rounded-md mt-6 hover:bg-[#1e7a00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={onCheckout}
      disabled={loading || isCartEmpty}
    >
      {loading ? "Đang xử lý..." : "Tiến hành thanh toán"}
    </button>
    <div className="mt-4 text-center">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Phương thức thanh toán:</h3>
      <div className="flex justify-center gap-3">
        {["VNPAY", "COD"].map((method) => (
          <div
            key={method}
            className="border border-gray-300 rounded-md p-2 bg-gray-50 text-sm text-gray-800"
          >
            {method}
          </div>
        ))}
      </div>
    </div>
  </div>
);

const CartPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { cart, loading, error, checkoutResponse } = useSelector<RootState, CartState>(
    (state) => state.cart
  );
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [orderInfo, setOrderInfo] = useState({
    recipientName: "",
    phoneNumber: "",
    shippingAddress: "",
    paymentMethod: "COD" as "VNPAY" | "COD",
    notes: "",
  });
  const [errors, setErrors] = useState({
    shippingAddress: "",
    paymentMethod: "",
    recipientName: "",
    phoneNumber: "",
  });

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    if (checkoutResponse?.paymentURL) {
      router.push(checkoutResponse.paymentURL);
    } else if (checkoutResponse?.id && checkoutResponse.paymentMethod === "COD") {
      toast.success("Thanh toán thành công! Đang chuyển đến đơn hàng...");
      setIsDialogOpen(false);
      setTimeout(() => {
        router.push(`/orders/${checkoutResponse.id}`);
        dispatch(clearCart());
      }, 2000);
    }
  }, [checkoutResponse, router, dispatch]);

  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
  }, []);

  const subtotal = cart?.items.reduce((total, item) => {
    const itemPrice = item.fruitDiscount > 0
      ? item.fruitPrice * (1 - item.fruitDiscount)
      : item.fruitPrice;
    return total + itemPrice * item.quantity;
  }, 0) || 0;
  const shipping = 0; // Loại bỏ phí vận chuyển
  const total = subtotal + shipping;

  const handlePlusItem = useCallback((fruitId: number) => {
    dispatch(plusCartItem(fruitId));
  }, [dispatch]);

  const handleMinusItem = useCallback((fruitId: number) => {
    dispatch(minusCartItem(fruitId));
  }, [dispatch]);

  const handleRemoveItem = useCallback((fruitId: number) => {
    dispatch(removeCartItem(fruitId));
  }, [dispatch]);

  const handleClearCart = useCallback(() => {
    dispatch(clearCart());
    dispatch(fetchCart());
    toast.success("Đã xóa toàn bộ giỏ hàng!");
  }, [dispatch]);

  const openCheckoutDialog = useCallback(() => {
    if (!cart || cart.items.length === 0) {
      toast.error("Giỏ hàng trống. Vui lòng thêm sản phẩm.");
      return;
    }
    setIsDialogOpen(true);
  }, [cart]);

  const closeCheckoutDialog = useCallback(() => {
    setIsDialogOpen(false);
    setOrderInfo({ recipientName: "", phoneNumber: "", shippingAddress: "", paymentMethod: "COD", notes: "" });
    setErrors({ shippingAddress: "", paymentMethod: "", recipientName: "", phoneNumber: "" });
  }, []);

  const handleOrderInfoChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setOrderInfo((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    },
    []
  );

  const validateOrderInfo = useCallback(() => {
    let isValid = true;
    const newErrors = { shippingAddress: "", paymentMethod: "", recipientName: "", phoneNumber: "" };

    if (!orderInfo.shippingAddress.trim()) {
      newErrors.shippingAddress = "Địa chỉ giao hàng là bắt buộc";
      isValid = false;
    } else if (orderInfo.shippingAddress.trim().length < 10) {
      newErrors.shippingAddress = "Địa chỉ giao hàng phải có ít nhất 10 ký tự";
      isValid = false;
    }

    if (!orderInfo.paymentMethod) {
      newErrors.paymentMethod = "Phương thức thanh toán là bắt buộc";
      isValid = false;
    } else if (!["VNPAY", "COD"].includes(orderInfo.paymentMethod)) {
      newErrors.paymentMethod = "Phương thức thanh toán không hợp lệ";
      isValid = false;
    }

    if (!orderInfo.recipientName.trim()) {
      newErrors.recipientName = "Tên người nhận là bắt buộc";
      isValid = false;
    } else if (orderInfo.recipientName.trim().length < 2) {
      newErrors.recipientName = "Tên người nhận phải có ít nhất 2 ký tự";
      isValid = false;
    }

    if (!orderInfo.phoneNumber.trim()) {
      newErrors.phoneNumber = "Số điện thoại là bắt buộc";
      isValid = false;
    } else if (!/^\d{10}$/.test(orderInfo.phoneNumber.trim())) {
      newErrors.phoneNumber = "Số điện thoại phải có đúng 10 chữ số";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }, [orderInfo]);

  const handleCheckout = useCallback(async () => {
    if (!validateOrderInfo()) {
      return;
    }
    setCheckoutLoading(true);
    try {
      await dispatch(checkoutCart(orderInfo)).unwrap();
    } catch (err: any) {
      toast.error(err || "Lỗi khi thanh toán. Vui lòng thử lại.");
    } finally {
      setCheckoutLoading(false);
    }
  }, [dispatch, orderInfo, validateOrderInfo]);

  return (
    <div className="py-6 bg-gray-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-[#269300] mb-6">Giỏ hàng của bạn</h1>

        {loading && !checkoutLoading && <div className="text-center py-6 text-gray-600">Đang tải...</div>}
        {error && <div className="text-center py-4 bg-red-50 rounded-md text-red-500">{error}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-4 border-b bg-gray-50">
                <h2 className="font-semibold text-gray-900 text-lg">
                  Sản phẩm ({cart?.items.length || 0})
                </h2>
              </div>
              {cart && cart.items.length > 0 ? (
                <>
                  {cart.items.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      loading={loading}
                      onPlus={handlePlusItem}
                      onMinus={handleMinusItem}
                      onRemove={handleRemoveItem}
                      formatPrice={formatPrice}
                    />
                  ))}
                  <div className="p-4 bg-gray-50 flex justify-between items-center">
                    <Link
                      href="/fruits"
                      className="text-[#269300] font-medium hover:underline flex items-center"
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
                          d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                      </svg>
                      Tiếp tục mua sắm
                    </Link>
                    <button
                      className="text-red-500 font-medium hover:underline flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleClearCart}
                      disabled={loading || !cart || cart.items.length === 0}
                    >
                      <Trash2 size={16} className="mr-1" /> Xóa tất cả
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-gray-500 text-lg">Giỏ hàng của bạn đang trống</p>
                  <Link
                    href="/fruits"
                    className="mt-4 inline-block bg-[#269300] text-white px-6 py-2 rounded-md hover:bg-[#1e7a00] transition-colors"
                  >
                    Tiếp tục mua sắm
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="lg:col-span-1">
            <OrderSummary
              subtotal={subtotal}
              total={subtotal}
              loading={checkoutLoading}
              onCheckout={openCheckoutDialog}
              formatPrice={formatPrice}
              isCartEmpty={!cart || cart.items.length === 0}
            />
          </div>
        </div>

        <Transition show={isDialogOpen}>
          <Dialog className="relative nii z-50" onClose={closeCheckoutDialog}>
            <Transition.Child
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Transition.Child
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md bg-white rounded-xl shadow-2xl p-6">
                  <div className="flex justify-between items-center mb-5">
                    <Dialog.Title as="h3" className="text-xl font-semibold text-gray-900">
                      Thông tin đặt hàng
                    </Dialog.Title>
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-600"
                      onClick={closeCheckoutDialog}
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="recipientName" className="block text-sm font-medium text-gray-700">
                        Người nhận
                      </label>
                      <input
                        type="text"
                        name="recipientName"
                        id="recipientName"
                        value={orderInfo.recipientName}
                        onChange={handleOrderInfoChange}
                        className="mt-1 w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-[#269300] focus:border-[#269300] transition"
                        placeholder="Nhập tên người nhận"
                      />
                      {errors.recipientName && (
                        <p className="mt-1 text-sm text-red-600">{errors.recipientName}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                        Số điện thoại
                      </label>
                      <input
                        type="text"
                        name="phoneNumber"
                        id="phoneNumber"
                        value={orderInfo.phoneNumber}
                        onChange={handleOrderInfoChange}
                        className="mt-1 w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-[#269300] focus:border-[#269300] transition"
                        placeholder="Nhập số điện thoại"
                      />
                      {errors.phoneNumber && (
                        <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="shippingAddress" className="block text-sm font-medium text-gray-700">
                        Địa chỉ giao hàng
                      </label>
                      <input
                        type="text"
                        name="shippingAddress"
                        id="shippingAddress"
                        value={orderInfo.shippingAddress}
                        onChange={handleOrderInfoChange}
                        className="mt-1 w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-[#269300] focus:border-[#269300] transition"
                        placeholder="Nhập địa chỉ giao hàng"
                      />
                      {errors.shippingAddress && (
                        <p className="mt-1 text-sm text-red-600">{errors.shippingAddress}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
                        Phương thức thanh toán
                      </label>
                      <select
                        name="paymentMethod"
                        id="paymentMethod"
                        value={orderInfo.paymentMethod}
                        onChange={handleOrderInfoChange}
                        className="mt-1 w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-[#269300] focus:border-[#269300] transition"
                      >
                        <option value="COD">Thanh toán khi nhận hàng (COD)</option>
                        <option value="VNPAY">Thanh toán qua VNPay</option>
                      </select>
                      {errors.paymentMethod && (
                        <p className="mt-1 text-sm text-red-600">{errors.paymentMethod}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                        Ghi chú (tùy chọn)
                      </label>
                      <textarea
                        name="notes"
                        id="notes"
                        value={orderInfo.notes}
                        onChange={handleOrderInfoChange}
                        rows={3}
                        className="mt-1 w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-[#269300] focus:border-[#269300] transition"
                        placeholder="Nhập ghi chú (nếu có)"
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end space-x-4">
                    <button
                      type="button"
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                      onClick={closeCheckoutDialog}
                    >
                      Hủy
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 bg-[#269300] text-white rounded-md hover:bg-[#1e7a00] disabled:opacity-50 disabled:cursor-not-allowed transition"
                      onClick={handleCheckout}
                      disabled={checkoutLoading}
                    >
                      {checkoutLoading ? "Đang xử lý..." : "Xác nhận"}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </div>
    </div>
  );
};

export default CartPage;