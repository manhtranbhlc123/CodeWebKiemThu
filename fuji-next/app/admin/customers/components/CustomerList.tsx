'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '@/app/store';
import {
  fetchCustomers,
  searchCustomers,
  deleteCustomer,
  resetCustomerPassword,
  clearError as clearCustomerError,
} from '@/app/store/slices/customerSlice';
import { fetchOrdersById, clearError as clearOrderError } from '@/app/store/slices/orderSlice';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../../../components/ui/table';
import { Badge } from '../../../../components/ui/badge';
import { useToast } from '../../../../components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../../components/ui/dialog';
import { Search } from 'lucide-react';
import CustomerForm from './CustomerForm';

interface Customer {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
}

interface Order {
  id: number;
  orderDate: string | Date;
  totalAmount: number;
  status: string;
  shippingAddress: string;
  paymentMethod: string;
  recipientName?: string;
  phoneNumber?: string;
}

interface CustomerListProps {
  initialCustomers?: Customer[];
}

export default function CustomerList({ initialCustomers = [] }: CustomerListProps) {
  const dispatch = useAppDispatch();
  const { customers, loading: customerLoading, error: customerError, orders } = useSelector((state: RootState) => state.customer);
  const { isAuthenticated, role } = useSelector((state: RootState) => state.auth);
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<number | null>(null);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [customerToReset, setCustomerToReset] = useState<number | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const ITEMS_PER_PAGE = 5;

  if (!isAuthenticated || role !== 'ROLE_ADMIN') {
    return (
      <div className="text-red-600 text-center py-4">
        Bạn không có quyền truy cập trang này.
      </div>
    );
  }
  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      if (mounted && initialCustomers.length > 0 && customers.length === 0) {
        await dispatch(fetchCustomers({ page: 0, size: 10 }));
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, [dispatch, initialCustomers]);

  useEffect(() => {
    const debounceSearch = setTimeout(() => {
      if (searchTerm) {
        dispatch(searchCustomers(searchTerm));
      } else {
        dispatch(fetchCustomers({ page: 0, size: 10 }));
      }
    }, 300);

    return () => clearTimeout(debounceSearch);
  }, [searchTerm, dispatch]);


  useEffect(() => {
    if (viewingCustomer && detailDialogOpen) {
      dispatch(fetchOrdersById(viewingCustomer.id));
    }
  }, [viewingCustomer, detailDialogOpen, dispatch]);

  const totalPages = Math.ceil(customers.length / ITEMS_PER_PAGE);
  const currentCustomers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return customers.slice(start, start + ITEMS_PER_PAGE);
  }, [customers, currentPage]);

  const handleDelete = useCallback(async (id: number) => {
    try {
      const result = await dispatch(deleteCustomer(id));
      if (deleteCustomer.fulfilled.match(result)) {
        toast({
          title: 'Thành công',
          description: 'Khách hàng đã được xóa thành công',
        });
        setDeleteDialogOpen(false);
        setCustomerToDelete(null);
      } else {
        throw new Error(result.payload as string);
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể xóa khách hàng',
        variant: 'destructive',
      });
    }
  }, [dispatch, toast]);

  const handleResetPassword = useCallback(async (id: number) => {
    try {
      const result = await dispatch(resetCustomerPassword(id));
      if (resetCustomerPassword.fulfilled.match(result)) {
        toast({
          title: 'Thành công',
          description: `Mật khẩu đã được đặt lại: ${result.payload.newPassword}`,
        });
        setResetPasswordDialogOpen(false);
        setCustomerToReset(null);
      } else {
        throw new Error(result.payload as string);
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể đặt lại mật khẩu',
        variant: 'destructive',
      });
    }
  }, [dispatch, toast]);

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center space-x-2 mt-4">
        {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? 'default' : 'outline'}
            size="sm"
            className={page === currentPage ? 'bg-blue-600 text-white' : 'text-gray-700'}
            onClick={() => setCurrentPage(page)}
            disabled={customerLoading}
          >
            {page}
          </Button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Danh Sách Khách Hàng</h2>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Tìm kiếm khách hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-200 focus:ring-2 focus:ring-blue-500"
            disabled={customerLoading}
          />
        </div>
        <Badge variant="secondary" className="px-4 py-2">
          Tổng: {customers.length} khách hàng
        </Badge>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên Khách Hàng</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Số Điện Thoại</TableHead>
              <TableHead>Địa Chỉ</TableHead>
              <TableHead className="text-center">Hành Động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customerLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : currentCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Không tìm thấy khách hàng
                </TableCell>
              </TableRow>
            ) : (
              currentCustomers.map((customer) => (
                <TableRow key={customer.id} className="hover:bg-gray-50">
                  <TableCell>{customer.fullName}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phoneNumber}</TableCell>
                  <TableCell>{customer.address}</TableCell>
                  <TableCell className="text-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setViewingCustomer(customer);
                        setDetailDialogOpen(true);
                      }}
                      disabled={customerLoading}
                    >
                      Chi tiết
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setCustomerToDelete(customer.id);
                        setDeleteDialogOpen(true);
                      }}
                      disabled={customerLoading}
                    >
                      Xóa
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setCustomerToReset(customer.id);
                        setResetPasswordDialogOpen(true);
                      }}
                      disabled={customerLoading}
                    >
                      Đặt lại mật khẩu
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {renderPagination()}

      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi Tiết Khách Hàng</DialogTitle>
          </DialogHeader>
          <CustomerForm viewingCustomer={viewingCustomer} />
        </DialogContent>
      </Dialog>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác Nhận Xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa khách hàng này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={customerLoading}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={() => customerToDelete && handleDelete(customerToDelete)}
              disabled={customerLoading}
            >
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={resetPasswordDialogOpen} onOpenChange={setResetPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác Nhận Reset Mật Khẩu</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn reset mật khẩu cho khách hàng này?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setResetPasswordDialogOpen(false)}
              disabled={customerLoading}
            >
              Hủy
            </Button>
            <Button
              variant="secondary"
              onClick={() => customerToReset && handleResetPassword(customerToReset)}
              disabled={customerLoading}
            >
              Đặt lại
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}