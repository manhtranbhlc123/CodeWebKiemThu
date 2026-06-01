'use client';
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '@/app/store';
import { fetchCustomerOrders } from '@/app/store/slices/customerSlice';
import { User, Mail, Phone, MapPin, ShoppingBag, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
interface Order {
  id: number;
  orderDate: string;
  totalAmount: number;
  status: string;
  shippingAddress: string;
  paymentMethod: string;
  recipientName?: string;
  phoneNumber?: string;
}
interface Customer {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
}

interface CustomerFormProps {
  viewingCustomer: Customer | null;
}

export default function CustomerForm({ viewingCustomer }: CustomerFormProps) {
  const dispatch = useAppDispatch();
  const { orders, loading, error } = useSelector((state: RootState) => state.customer);
  
  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  }, []);

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return format(toZonedTime(date, 'Asia/Ho_Chi_Minh'), 'dd/MM/yyyy');
  };
  const statusMap: { [key: string]: string } = {
    PENDING: 'Đang xử lý',
    SHIPPED: 'Đã giao',
    DELIVERED: 'Đã nhận',
    CANCELLED: 'Đã hủy',
  };

  useEffect(() => {
    if (viewingCustomer) {
      dispatch(fetchCustomerOrders(viewingCustomer.id));
    }
  }, [dispatch, viewingCustomer]);

  if (!viewingCustomer) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p className="text-lg">Không có thông tin khách hàng.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 max-w-7xl mx-auto bg-gray-50">
      <div className="md:w-1/3 bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800">Thông tin khách hàng</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-gray-500" />
            <div>
              <label className="block text-sm font-medium text-gray-600">Họ và tên</label>
              <p className="mt-1 text-lg font-medium text-gray-900">{viewingCustomer.fullName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-gray-500" />
            <div>
              <label className="block text-sm font-medium text-gray-600">Email</label>
              <p className="mt-1 text-sm text-gray-900">{viewingCustomer.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-gray-500" />
            <div>
              <label className="block text-sm font-medium text-gray-600">Số điện thoại</label>
              <p className="mt-1 text-sm text-gray-900">{viewingCustomer.phoneNumber || 'Không có'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gray-500" />
            <div>
              <label className="block text-sm font-medium text-gray-600">Địa chỉ</label>
              <p className="mt-1 text-sm text-gray-900">{viewingCustomer.address || 'Không có'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="md:w-2/3 bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <ShoppingBag className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800">Lịch sử mua hàng</h2>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="ml-2 text-gray-500 text-lg">Đang tải đơn hàng...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-10">
            <p className="text-red-500 text-lg">Lỗi: {error}</p>
          </div>
        ) : orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Mã đơn hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Ngày mua
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Tổng tiền
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order: Order) => (
                  <tr key={order.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className="text-blue-600 hover:text-blue-800 transition-colors">
                        #ORD-{order.id}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(order.orderDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === 'DELIVERED'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'SHIPPED'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {statusMap[order.status] || order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex items-center justify-center py-10">
            <p className="text-gray-500 text-lg">Chưa có đơn hàng nào.</p>
          </div>
        )}
      </div>
    </div>
  );
}