'use client';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { useState, useEffect } from 'react';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '../../../../components/ui/table';
import { Badge } from '../../../../components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../../../../components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { useToast } from '../../../../components/ui/use-toast';
import ProductForm from './ProductForm';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  getFruitsPaginated,
  deleteFruit,
  createFruit,
  updateFruit,
  searchFruits,
} from '@/app/admin/services/fruitService';
import { Fruit, FruitPOST, PaginatedFruits } from '../../types';
import { BaseURL } from '@/app/utils/baseUrl';

export default function ProductList() {
  const [paginatedFruits, setPaginatedFruits] = useState<PaginatedFruits | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 5;
  const [searchTerm, setSearchTerm] = useState('');
  const [triggerSearch, setTriggerSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Fruit | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  const { toast } = useToast();

  useEffect(() => {
    if (triggerSearch && searchQuery.trim()) {
      fetchSearchResults();
    } else {
      fetchFruits();
    }
  }, [currentPage, triggerSearch, searchQuery]);

  const fetchFruits = async () => {
    setLoading(true);
    try {
      const data = await getFruitsPaginated(currentPage, pageSize);
      setPaginatedFruits(data.data);
      setError(null);
      console.log('Search results:', data.data);
    } catch (err) {
      setError('Không thể tải danh sách sản phẩm');
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách sản phẩm',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSearchResults = async () => {
    setLoading(true);
    try {
      const data = await searchFruits(searchQuery, currentPage, pageSize,
        minPrice ? Number(minPrice) : undefined, maxPrice ? Number(maxPrice) : undefined);
      setPaginatedFruits(data.data);
      setError(null);
    } catch (err) {
      setError('Không thể tìm kiếm sản phẩm');
      toast({
        title: 'Lỗi',
        description: 'Không thể tìm kiếm sản phẩm',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (newProduct: FruitPOST) => {
    try {
      await createFruit(newProduct);
      toast({ title: 'Thành công', description: 'Thêm sản phẩm thành công' });
      if (triggerSearch && searchQuery.trim()) {
        fetchSearchResults();
      } else {
        fetchFruits();
      }
      setFormDialogOpen(false);
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: 'Thêm sản phẩm thất bại',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateProduct = async (updatedProduct: Fruit) => {
    try {
      await updateFruit(updatedProduct.id, updatedProduct);
      toast({ title: 'Thành công', description: 'Cập nhật sản phẩm thành công' });
      if (triggerSearch && searchQuery.trim()) {
        fetchSearchResults();
      } else {
        fetchFruits();
      }
      setEditingProduct(null);
      setFormDialogOpen(false);
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: 'Cập nhật sản phẩm thất bại',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteFruit(id);
      toast({ title: 'Thành công', description: 'Xóa sản phẩm thành công' });
      if (triggerSearch && searchQuery.trim()) {
        fetchSearchResults();
      } else {
        fetchFruits();
      }
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: 'Xóa sản phẩm thất bại',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const formatImportDate = (dateString: string | null | undefined) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return format(toZonedTime(date, 'Asia/Ho_Chi_Minh'), 'dd/MM/yyyy');
  };
  // const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === 'Enter' && searchTerm.trim()) {
  //     setCurrentPage(0);
  //     setSearchQuery(searchTerm);
  //     setTriggerSearch(true);
  //   }
  // };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (!e.target.value.trim()) {
      setTriggerSearch(false);
      setSearchQuery('');
      setCurrentPage(0);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <svg className="w-8 h-8 mr-3 text-green-600 animate-spin" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        <span className="text-gray-600 dark:text-gray-300">Đang tải...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-lg text-center text-red-500 bg-white rounded-lg shadow-md dark:bg-gray-800">
        {error}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl"
    >
      <Card className="bg-white shadow-lg dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-green-700 dark:text-green-400">
            Quản lý sản phẩm
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => {
                  setEditingProduct(null);
                  setFormDialogOpen(true);
                }}
                className="text-white bg-green-600 hover:bg-green-700"
              >
                Thêm sản phẩm
              </Button>
            </motion.div>
            <div className="flex items-center space-x-4">
              <div className="relative w-64">
                <Search className="absolute w-4 h-4 text-gray-500 transform -translate-y-1/2 left-3 top-1/2 dark:text-gray-400" />
                <Input
                  placeholder="Tìm kiếm sản phẩm (tên, danh mục...)"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  // onKeyDown={handleSearch}
                  className="pl-10 bg-white border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <Input
                type="number"
                placeholder="Giá từ"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="bg-white w-28 dark:bg-gray-700 dark:text-gray-200"
              />

              {/* Giá đến */}
              <Input
                type="number"
                placeholder="Giá đến"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="bg-white w-28 dark:bg-gray-700 dark:text-gray-200"
              />
              <Button
                onClick={() => {
                  setCurrentPage(0);
                  setSearchQuery(searchTerm);
                  setTriggerSearch(true);
                }}
                className="text-white bg-green-600 hover:bg-green-700"
              >
                Lọc
              </Button>
              <Badge
                variant="outline"
                className="px-3 py-1 text-green-600 border-green-600 dark:text-green-400 dark:border-green-400"
              >
                Tổng: {paginatedFruits?.totalElements || 0} sản phẩm
              </Badge>
            </div>
          </div>

          {/* Bảng sản phẩm */}
          <div className="overflow-x-auto">
            <Table className="w-full border-separate border-spacing-y-2">
              <TableHeader>
                <TableRow className="bg-gray-100 dark:bg-gray-700">
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-200">Ảnh</TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-200">Tên</TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-200">Giá</TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-200">Tồn kho</TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-200">Danh mục</TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-200">Tags</TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-200">Ngày nhập</TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-200">Xuất xứ</TableHead>
                  <TableHead className="font-semibold text-center text-gray-700 dark:text-gray-200">
                    Hành động
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedFruits?.content && paginatedFruits.content.length > 0 ? (
                  paginatedFruits.content.map((product) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="transition-colors bg-white rounded-lg shadow-sm dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <TableCell className="py-3">
                        <img
                          src={`${BaseURL.baseImage}${product.image}`}
                          alt={product.name}
                          className="object-cover w-12 h-12 border border-gray-200 rounded-lg dark:border-gray-600"
                        />
                      </TableCell>
                      <TableCell className="py-3 text-gray-800 dark:text-gray-200">{product.name}</TableCell>
                      <TableCell className="py-3 text-gray-600 dark:text-gray-300">
                        {product.price.toLocaleString()} VND
                      </TableCell>
                      <TableCell className="py-3 text-center text-gray-600 dark:text-gray-300">
                        {product.quantity}
                      </TableCell>
                      <TableCell className="py-3 text-gray-600 dark:text-gray-300">
                        {product.categories.map((category) => category.name).join(', ')}
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="flex flex-wrap gap-2">
                          {product.tags.map((tag: string, index: number) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="px-3 py-1 text-green-800 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-300 hover:bg-white"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="py-3 text-gray-600 dark:text-gray-300">
                        {formatImportDate(product.importDate)}
                      </TableCell>
                      <TableCell className="py-3 text-gray-600 dark:text-gray-300">{product.origin}</TableCell>
                      <TableCell className="py-3 space-x-2 text-center">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingProduct(product);
                              setFormDialogOpen(true);
                            }}
                            className="text-green-600 border-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-gray-600"
                          >
                            Sửa
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setProductToDelete(product.id);
                              setDeleteDialogOpen(true);
                            }}
                            className="text-white bg-red-600 hover:bg-red-700"
                          >
                            Xóa
                          </Button>
                        </motion.div>
                      </TableCell>
                    </motion.tr>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="py-6 text-center text-gray-500 dark:text-gray-400">
                      Không tìm thấy sản phẩm
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Phân trang */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: paginatedFruits?.totalPages || 1 }, (_, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  variant={idx === currentPage ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePageChange(idx)}
                  className={`rounded-full w-10 h-10 ${idx === currentPage
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'border-green-600 text-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-gray-600'
                    }`}
                >
                  {idx + 1}
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
        <DialogContent className="max-w-4xl w-[90vw] max-h-[80vh] h-auto overflow-y-auto bg-white dark:bg-gray-800 rounded-2xl p-6">
          <DialogHeader >
            <DialogTitle className="text-2xl font-bold text-green-700 dark:text-green-400">
              {editingProduct ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <ProductForm
              onAddProduct={handleAddProduct}
              onUpdateProduct={handleUpdateProduct}
              editingProduct={editingProduct}
              setEditingProduct={setEditingProduct}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog xác nhận xóa */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md w-[90vw] bg-white dark:bg-gray-800 rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-green-700 dark:text-green-400">
              Xác nhận xóa
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-300">
              Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                className="text-green-600 border-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-gray-600"
              >
                Hủy
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="destructive"
                onClick={() => productToDelete && handleDelete(productToDelete)}
                className="text-white bg-red-600 hover:bg-red-700"
              >
                Xóa
              </Button>
            </motion.div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}