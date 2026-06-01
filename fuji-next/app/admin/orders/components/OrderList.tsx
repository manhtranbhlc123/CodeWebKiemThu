'use client';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '@/app/store';
import {
  fetchOrders,
  deleteOrder,
  clearError,
  updateOrderStatus,
  exportOrdersToExcel
} from '@/app/store/slices/orderSlice';
import { Button } from '../../../../components/ui/button';
import { Table } from '../../../../components/ui/table';
import { Badge } from '../../../../components/ui/badge';
import { useToast } from '../../../../components/ui/use-toast';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../../../components/ui/dialog';
import { X } from 'lucide-react';
import {OrderItem } from '@/app/store/types';
import { Order } from '@/app/store/slices/profileSlice';
import Token from '@/app/utils/token';

export default function OrderList() {
  const dispatch = useAppDispatch();
  const { orders, loading, error, totalPages } = useSelector((state: RootState) => state.order);
  const { isAuthenticated, role } = useSelector((state: RootState) => state.auth);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<number | null>(null);
  const [viewPanelOpen, setViewPanelOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [statusChangeOrder, setStatusChangeOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<string>('');
  const { toast } = useToast();

  const [excelBlob, setExcelBlob] = useState<Blob | null>(null);
  console.log(orders);
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(0); // Zero-based for backend

  if (!isAuthenticated || role !== 'ROLE_ADMIN') {
    return (
      <div className="py-4 text-center text-red-600 bg-white rounded-lg shadow-md dark:bg-gray-800">
        Bạn không có quyền truy cập trang này.
      </div>
    );
  }

  useEffect(() => {
    dispatch(fetchOrders({ page: currentPage, size: itemsPerPage }));
    // console.log(totalPages);
    
  }, [dispatch, currentPage]);

  useEffect(() => {
    if (error) {
      toast({ title: 'Lỗi', description: error, variant: 'destructive' });
      dispatch(clearError());
    }
  }, [error, toast, dispatch]);

  const handlePageChange = (page: number) => {
    if (page >= 0 && page < totalPages && !loading) {
      setCurrentPage(page);
    }
  };

  const handleDelete = (id: number) => {
    dispatch(deleteOrder(id)).then((result: any) => {
      if (deleteOrder.fulfilled.match(result)) {
        toast({ title: 'Thành công', description: 'Đơn hàng đã được xóa thành công' });
        setDeleteDialogOpen(false);
        setOrderToDelete(null);
      } else {
        toast({ title: 'Lỗi', description: result.payload as string, variant: 'destructive' });
      }
    });
  };

  const handleStatusChange = (order: Order, status: string) => {
    setStatusChangeOrder(order);
    setNewStatus(status);
    setStatusDialogOpen(true);
  };

  const confirmStatusChange = () => {
    if (statusChangeOrder && newStatus) {
      dispatch(updateOrderStatus({ ...statusChangeOrder, status: newStatus })).then((result: any) => {
        if (updateOrderStatus.fulfilled.match(result)) {
          toast({ title: 'Thành công', description: 'Trạng thái đơn hàng đã được cập nhật' });
          setStatusDialogOpen(false);
          setStatusChangeOrder(null);
          setNewStatus('');
        } else {
          toast({ title: 'Lỗi', description: result.payload as string, variant: 'destructive' });
        }
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Đang chờ';
      case 'PROCESSING':
        return 'Đang xử lý';
      case 'SHIPPED':
        return 'Đã giao hàng';
      case 'DELIVERED':
        return 'Đã nhận hàng';
      case 'CANCELLED':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'Cash':
        return 'Tiền mặt';
      case 'BankTransfer':
        return 'Chuyển khoản';
      case 'CreditCard':
        return 'Thẻ tín dụng';
      default:
        return method;
    }
  };
  
  const handleExportExcel = async () => {
    dispatch(exportOrdersToExcel()).then(async (result: any) => {
      if (exportOrdersToExcel.fulfilled.match(result)) {
        const blob = await result.payload;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "orders.xlsx";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      }
      
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl"
    >
      <Card className="bg-white shadow-lg dark:bg-gray-800">
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle className="text-2xl font-bold text-green-700 dark:text-green-400">
            Quản lý đơn hàng
          </CardTitle>
          <div className='flex flex-col items-end justify-between gap-2'>
            <button onClick={handleExportExcel} className='p-2 px-4 bg-white border border-green-400 rounded-lg text-md hover:bg-green-500 hover:text-white'>Xuất Excel</button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Badge
              variant="outline"
              className="px-3 py-1 text-green-600 border-green-600 dark:text-green-400 dark:border-green-400"
            >
              Tổng: {orders.length} đơn hàng
            </Badge>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <svg className="w-8 h-8 mr-3 text-green-600 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span className="text-gray-600 dark:text-gray-300">Đang tải...</span>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-8 text-center text-gray-500 dark:text-gray-400">
              Không có đơn hàng nào. Hãy thêm đơn hàng mới!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="w-full border-separate border-spacing-y-2">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700">
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-200">
                      ID
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-200">
                      Ngày đặt
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-700 uppercase dark:text-gray-200">
                      Tổng tiền
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-200">
                      Địa chỉ giao
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-700 uppercase dark:text-gray-200">
                      Phương thức TT
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-700 uppercase dark:text-gray-200">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-700 uppercase dark:text-gray-200">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="transition-colors bg-white rounded-md dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200 whitespace-nowrap">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200 whitespace-nowrap">
                        {format(new Date(order.orderDate), 'dd/MM/yyyy')}
                      </td>

                      <td className="px-6 py-4 text-sm text-right whitespace-nowrap">
                        <Badge
                          variant="secondary"
                          className="px-2 py-1 text-green-800 bg-green-100 dark:bg-green-900 dark:text-green-300"
                        >
                          {order.totalAmount.toLocaleString()} VND
                        </Badge>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                        {order.shippingAddress}
                      </td>

                      <td className="px-6 py-4 text-sm text-center text-gray-600 dark:text-gray-300 whitespace-nowrap">
                        {getPaymentMethodText(order.paymentMethod)}
                      </td>

                      <td className="px-6 py-4 text-sm text-center whitespace-nowrap">
                        <Select
                          value={order.status}
                          onValueChange={(value) => {
                            if (value) {
                              handleStatusChange(order as Order, value);
                            }
                          }}
                          disabled={loading}
                        >
                          <SelectTrigger className="w-[120px] border-gray-300 dark:border-gray-600 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-gray-200">
                            <SelectValue placeholder="Chọn trạng thái" />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-gray-800">
                            <SelectItem value="PENDING">Đang chờ</SelectItem>
                            <SelectItem value="PROCESSING">Đang xử lý</SelectItem>
                            <SelectItem value="SHIPPED">Đã giao hàng</SelectItem>
                            <SelectItem value="DELIVERED">Đã nhận hàng</SelectItem>
                            <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>

                      {/* Hành động */}
                      <td className="px-6 py-4 space-x-2 text-sm text-center whitespace-nowrap">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                          <Button
                            variant="default"
                            size="sm"
                            className="text-white bg-green-600 hover:bg-green-700"
                            onClick={() => {
                              setSelectedOrder(order as Order);
                              setViewPanelOpen(true);
                              console.log(order);
                            }}
                            disabled={loading}
                          >
                            Xem
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                          <Button
                            variant="destructive"
                            size="sm"
                            className="text-white bg-red-600 hover:bg-red-700"
                            onClick={() => {
                              setOrderToDelete(order.id);
                              setDeleteDialogOpen(true);
                            }}
                            disabled={loading}
                          >
                            Xóa
                          </Button>
                        </motion.div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center mt-6 space-x-2">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-green-600 border-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-gray-600"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={loading || currentPage === 0}
                >
                  Trước
                </Button>
              </motion.div>
              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, idx) => idx).map((page) => (
                  <motion.div
                    key={page}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      variant={page === currentPage ? 'default' : 'outline'}
                      size="sm"
                      className={`rounded-full w-10 h-10 ${page === currentPage
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'border-green-600 text-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-gray-600'
                        }`}
                      onClick={() => handlePageChange(page)}
                      disabled={loading}
                    >
                      {page + 1}
                    </Button>
                  </motion.div>
                ))}
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-green-600 border-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-gray-600"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={loading || currentPage === totalPages - 1}
                >
                  Sau
                </Button>
              </motion.div>
            </div>
          )}
        </CardContent>
      </Card>

      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: viewPanelOpen ? 0 : '100%' }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 right-0 z-50 w-full h-full overflow-y-auto bg-white shadow-xl sm:w-96 dark:bg-gray-800"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-green-700 dark:text-green-400">
              Chi tiết đơn hàng
            </h2>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                className="text-green-600 border-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-gray-600"
                onClick={() => setViewPanelOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Ngày đặt hàng
                  </p>
                  <p className="text-gray-800 dark:text-gray-200">
                    {format(new Date(selectedOrder.orderDate), 'dd/MM/yyyy')}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Trạng thái
                  </p>
                  <p>
                    <Badge
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                        selectedOrder.status
                      )}`}
                    >
                      {getStatusText(selectedOrder.status)}
                    </Badge>
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Tổng tiền
                  </p>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">
                    {selectedOrder.totalAmount.toLocaleString()} VND
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Phương thức thanh toán
                  </p>
                  <p className="text-gray-800 dark:text-gray-200">
                    {getPaymentMethodText(selectedOrder.paymentMethod)}
                  </p>
                </div>
                
                <div className="">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Người nhận
                  </p>
                  <p className="text-gray-800 dark:text-gray-200">
                    {selectedOrder.recipientName}
                  </p>
                </div>

                
                <div className="col-span-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Địa chỉ giao hàng
                  </p>
                  <p className="text-gray-800 dark:text-gray-200">
                    {selectedOrder.shippingAddress}
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Sản phẩm
                </p>
                <div className="border border-gray-200 rounded-lg dark:border-gray-600">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-2 text-xs font-medium text-left text-gray-500 dark:text-gray-300">
                          Sản phẩm
                        </th>
                        <th className="px-4 py-2 text-xs font-medium text-right text-gray-500 dark:text-gray-300">
                          Số lượng
                        </th>
                        <th className="px-4 py-2 text-xs font-medium text-right text-gray-500 dark:text-gray-300">
                          Đơn giá
                        </th>
                        <th className="px-4 py-2 text-xs font-medium text-right text-gray-500 dark:text-gray-300">
                          Thành tiền
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-600">
                      {selectedOrder.items?.map((item: OrderItem) => (
                        <tr key={item.id}>
                          <td className="px-4 py-2 text-sm text-gray-800 whitespace-nowrap dark:text-gray-200">
                            {item.fruit.name}
                          </td>
                          <td className="px-4 py-2 text-sm text-right text-gray-600 whitespace-nowrap dark:text-gray-300">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-2 text-sm text-right text-gray-600 whitespace-nowrap dark:text-gray-300">
                            {item.price.toLocaleString()} VND
                          </td>
                          <td className="px-4 py-2 text-sm text-right text-gray-600 whitespace-nowrap dark:text-gray-300">
                            {(item.quantity * item.price).toLocaleString()} VND
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md w-[90vw] bg-white dark:bg-gray-800 rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-green-700 dark:text-green-400">
              Xác nhận xóa
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-300">
              Bạn có chắc chắn muốn xóa đơn hàng này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                disabled={loading}
                className="text-green-600 border-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-gray-600"
              >
                Hủy
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="destructive"
                onClick={() => orderToDelete && handleDelete(orderToDelete)}
                disabled={loading}
                className="text-white bg-red-600 hover:bg-red-700"
              >
                Xóa
              </Button>
            </motion.div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Status Change Confirmation Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent className="max-w-md w-[90vw] bg-white dark:bg-gray-800 rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-green-700 dark:text-green-400">
              Xác nhận thay đổi trạng thái
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-300">
              Bạn có chắc chắn muốn thay đổi trạng thái đơn hàng sang{' '}
              <strong>{getStatusText(newStatus)}</strong>?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={() => setStatusDialogOpen(false)}
                disabled={loading}
                className="text-green-600 border-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-gray-600"
              >
                Hủy
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="default"
                onClick={confirmStatusChange}
                disabled={loading}
                className="text-white bg-green-600 hover:bg-green-700"
              >
                Xác nhận
              </Button>
            </motion.div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}