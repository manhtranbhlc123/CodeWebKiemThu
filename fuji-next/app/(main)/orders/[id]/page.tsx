'use client';
import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { AppDispatch, RootState } from '@/app/store';
import { BaseURL } from '@/app/utils/baseUrl';
import { fetchOrder, cancelOrder, OrderState } from '@/app/store/slices/orderSlice';
import Token from '@/app/utils/token';
import { 
  CalendarIcon, 
  UserIcon, 
  PhoneIcon, 
  MapPinIcon, 
  CreditCardIcon, 
  TagIcon,
  ShoppingBagIcon 
} from '@heroicons/react/24/outline';

interface Fruit {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface OrderItem {
  id: number;
  fruit: Fruit;
  quantity: number;
  price: number;
  discount?: number; // Added for discount support
}

interface Order {
  id: number;
  user: { id: number; username: string; email: string };
  items: OrderItem[];
  orderDate: string;
  totalAmount: number;
  status: string;
  shippingAddress: string;
  paymentMethod: string;
  recipientName: string;
  phoneNumber: string;
  notes?: string; // Added for order notes
}

interface OrderItemProps {
  item: OrderItem;
  formatPrice: (price: number) => string;
}

interface OrderSummaryProps {
  order: Order;
  formatPrice: (price: number) => string;
  formatDate: (date: string) => string;
  statusMap: { [key: string]: string };
  onCancel: () => void;
  onReorder: () => void;
  isCancelDisabled: boolean;
}

const OrderItem: React.FC<OrderItemProps> = ({ item, formatPrice }) => {
  const originalPrice = item.price;
  const discountedPrice = item.discount && item.discount > 0 
    ? item.price * (1 - item.discount)
    : item.price;
  const totalPrice = discountedPrice * item.quantity;

  return (
    <div className="flex items-center p-6 border-b bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex-shrink-0">
        <img
          src={`${BaseURL.baseImage}${item.fruit.image}`}
          alt={item.fruit.name}
          width={100}
          height={100}
          className="rounded-lg object-cover"
          onError={(e) => (e.currentTarget.src = '/placeholder.svg?height=100&width=100')}
        />
      </div>
      <div className="ml-6 flex-grow">
        <h3 className="text-lg font-semibold text-gray-900">{item.fruit.name}</h3>
        <div className="mt-2 flex items-center space-x-4">
          {item.discount && item.discount > 0 ? (
            <>
              <p className="text-sm text-gray-500 line-through">{formatPrice(originalPrice)}</p>
              <p className="text-[#269300] font-semibold">{formatPrice(discountedPrice)}</p>
            </>
          ) : (
            <p className="text-[#269300] font-semibold">{formatPrice(originalPrice)}</p>
          )}
        </div>
      </div>
      <div className="ml-6 text-right">
        <p className="text-gray-600">Số lượng: <span className="font-medium">{item.quantity}</span></p>
        <p className="text-lg font-bold text-gray-900 mt-1">{formatPrice(totalPrice)}</p>
      </div>
    </div>
  );
};

const OrderSummary: React.FC<OrderSummaryProps> = ({
  order,
  formatPrice,
  formatDate,
  statusMap,
  onCancel,
  onReorder,
  isCancelDisabled,
}) => (
  <div className="bg-white rounded-lg shadow-lg p-6">
    <h2 className="text-xl font-bold text-gray-900 mb-6">Thông tin đơn hàng</h2>
    <div className="space-y-4">
      <div className="flex items-center">
        <TagIcon className="h-5 w-5 text-gray-500 mr-2" />
        <span className="text-gray-600">Mã đơn hàng:</span>
        <span className="font-semibold ml-2">{order.id}</span>
      </div>
      <div className="flex items-center">
        <CalendarIcon className="h-5 w-5 text-gray-500 mr-2" />
        <span className="text-gray-600">Ngày đặt hàng:</span>
        <span className="font-semibold ml-2">{formatDate(order.orderDate)}</span>
      </div>
      <div className="flex items-center">
        <UserIcon className="h-5 w-5 text-gray-500 mr-2" />
        <span className="text-gray-600">Tên người nhận:</span>
        <span className="font-semibold ml-2">{order.recipientName}</span>
      </div>
      <div className="flex items-center">
        <PhoneIcon className="h-5 w-5 text-gray-500 mr-2" />
        <span className="text-gray-600">Số điện thoại:</span>
        <span className="font-semibold ml-2">{order.phoneNumber}</span>
      </div>
      <div className="flex items-center">
        <MapPinIcon className="h-5 w-5 text-gray-500 mr-2" />
        <span className="text-gray-600">Địa chỉ giao hàng:</span>
        <span className="font-semibold ml-2">{order.shippingAddress}</span>
      </div>
      <div className="flex items-center">
        <CreditCardIcon className="h-5 w-5 text-gray-500 mr-2" />
        <span className="text-gray-600">Phương thức thanh toán:</span>
        <span className="font-semibold ml-2">{order.paymentMethod}</span>
      </div>
      {order.notes && (
        <div className="flex items-start">
          <span className="text-gray-600">Ghi chú:</span>
          <span className="font-semibold ml-2 text-gray-800">{order.notes}</span>
        </div>
      )}
      <div className="flex items-center">
        <span className="text-gray-600">Trạng thái:</span>
        <span
          className={`ml-2 px-3 py-1 text-sm font-semibold rounded-full ${
            order.status === 'DELIVERED' || order.status === 'SHIPPED'
              ? 'bg-green-100 text-green-800'
              : order.status === 'PENDING'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {statusMap[order.status] || order.status}
        </span>
      </div>
      {(order.status === 'SHIPPED' || order.status === 'DELIVERED') && (
        <div>
          <span className="text-gray-600">Theo dõi đơn hàng:</span>
          <span  className="font-semibold ml-2 text-[#269300] hover:underline cursor-pointer">Xem chi tiết</span>
        </div>
      )}
      <div className="border-t pt-4 flex justify-between items-center">
        <span className="text-lg font-semibold text-gray-900">Tổng cộng:</span>
        <span className="text-xl font-bold text-[#269300]">{formatPrice(order.totalAmount)}</span>
      </div>
    </div>
    <div className="mt-6 space-y-3">
      {order.status === 'PENDING' && (
        <button
          onClick={onCancel}
          disabled={isCancelDisabled}
          className="w-full py-3 text-white bg-red-600 rounded-lg hover:bg-red-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Hủy đơn hàng
        </button>
      )}
      {(order.status === 'DELIVERED' || order.status === 'SHIPPED') && (
        <button
          onClick={onReorder}
          className="w-full py-3 text-white bg-[#269300] rounded-lg hover:bg-[#1e7a00] transition duration-200"
        >
          Đặt lại đơn hàng
        </button>
      )}
    </div>
  </div>
);

const OrderDetailPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { order, loading, error } = useSelector<RootState, OrderState>((state) => state.order);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  useEffect(() => {
    const token = Token.getAuthToken();
    if (!token) {
      toast.error('Vui lòng đăng nhập để tiếp tục.');
      router.push('/login');
      return;
    }
    if (id) {
      const orderId = Number(id);
      if (isNaN(orderId)) {
        toast.error('ID đơn hàng không hợp lệ.');
        return;
      }
      if (!order || order.id !== orderId) {
        dispatch(fetchOrder(orderId));
      }
    }
  }, [dispatch, router, id, order]);

  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  }, []);

  const formatDate = useCallback((date: string) => {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  }, []);

  const statusMap: { [key: string]: string } = {
    PENDING: 'Đang xử lý',
    SHIPPED: 'Đã giao',
    DELIVERED: 'Đã nhận',
    CANCELLED: 'Đã hủy',
  };

  const handleCancelOrder = useCallback(async () => {
    if (!order) return;
    try {
      await dispatch(cancelOrder(order.id)).unwrap();
      toast.success('Hủy đơn hàng thành công!');
      setIsCancelModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Lỗi khi hủy đơn hàng');
    }
  }, [dispatch, order]);

  const handleReorder = useCallback(() => {
    // Placeholder: Implement reorder logic (e.g., add items to cart and redirect)
    toast.info('Chức năng đặt lại đơn hàng đang được phát triển.');
  }, []);

  const openCancelModal = useCallback(() => {
    setIsCancelModalOpen(true);
  }, []);

  const closeCancelModal = useCallback(() => {
    setIsCancelModalOpen(false);
  }, []);

  if (!id || isNaN(Number(id))) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 text-red-600 rounded-lg p-6 text-center">
            Lỗi: ID đơn hàng không hợp lệ
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-2">
            <li className="flex items-center">
              <Link href="/" className="text-gray-600 hover:text-[#269300] font-medium">
                Trang chủ
              </Link>
            </li>
            <li className="flex items-center">
              <svg
                className="w-4 h-4 text-gray-400 mx-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <Link href="/profile" className="text-gray-600 hover:text-[#269300] font-medium">
                Hồ sơ
              </Link>
            </li>
            <li className="flex items-center">
              <svg
                className="w-4 h-4 text-gray-400 mx-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-500 font-medium">Chi tiết đơn hàng #{id}</span>
            </li>
          </ol>
        </nav>

        <h1 className="text-3xl font-bold text-[#269300] mb-8">Chi tiết đơn hàng #{id}</h1>

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#269300] mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải...</p>
          </div>
        )}
        {error && (
          <div className="bg-red-50 text-red-600 rounded-lg p-6 text-center">
            Lỗi: {error}
          </div>
        )}

        {order && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Sản phẩm ({order.items?.length || 0})
                  </h2>
                  <ShoppingBagIcon className="h-6 w-6 text-[#269300]" />
                </div>
                <div className="space-y-4">
                  
                  {order.items.length > 0  ?  (
                    order.items.map((item) => (
                      <OrderItem
                        key={item.id}
                        item={item as OrderItem}
                        formatPrice={formatPrice}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Không có sản phẩm trong đơn hàng.
                    </div>
                  )}
                </div>
                <div className="mt-6 border-t pt-4">
                  <Link
                    href="/profile"
                    className="inline-flex items-center text-[#269300] hover:underline font-medium"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
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
                    Quay lại hồ sơ
                  </Link>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <OrderSummary
                order={order as Order}
                formatPrice={formatPrice}
                formatDate={formatDate}
                statusMap={statusMap}
                onCancel={openCancelModal}
                onReorder={handleReorder}
                isCancelDisabled={loading}
              />
            </div>
          </div>
        )}
      </div>

      <Transition show={isCancelModalOpen}>
        <Dialog className="relative z-50" onClose={closeCancelModal}>
          <Transition.Child
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity" />
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
                <div className="flex justify-between items-center mb-6">
                  <Dialog.Title as="h3" className="text-xl font-semibold text-gray-900">
                    Xác nhận hủy đơn hàng
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600 transition"
                    onClick={closeCancelModal}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <p className="text-gray-600 mb-8">
                  Bạn có chắc chắn muốn hủy đơn hàng #{id}? Hành động này không thể hoàn tác.
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={closeCancelModal}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelOrder}
                    disabled={loading}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Đang xử lý...' : 'Xác nhận hủy'}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default OrderDetailPage;