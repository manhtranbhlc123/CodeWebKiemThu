'use client';

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
import CategoryForm from './CategoryForm';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { Category, PaginatedCategories } from '../../types';
import { createCategory, deleteCategory, getCategoriesPaginated, updateCategory } from '../../services/categoryService';

export default function CategoryList() {
  const [paginatedCategories, setPaginatedCategories] = useState<PaginatedCategories | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [triggerSearch, setTriggerSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 5;

  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, [currentPage, triggerSearch, searchQuery]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategoriesPaginated(currentPage, pageSize);
      let filteredContent = data.data.content;
      if (triggerSearch && searchQuery.trim()) {
        filteredContent = data.data.content.filter((category: Category) =>
          category.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      setPaginatedCategories({
        ...data.data,
        content: filteredContent,
      });
      setError(null);
    } catch (err: any) {
      setError('Không thể tải danh sách danh mục');
      toast({
        title: 'Lỗi',
        description: err.message || 'Không thể tải danh sách danh mục',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (newCategory: Omit<Category, 'id'>) => {
    try {
      await createCategory(newCategory);
      toast({ title: 'Thành công', description: 'Thêm danh mục thành công' });
      fetchCategories();
      setFormDialogOpen(false);
    } catch (err: any) {
      toast({
        title: 'Lỗi',
        description: err.message || 'Thêm danh mục thất bại',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateCategory = async (updatedCategory: Category) => {
    try {
      await updateCategory(updatedCategory.id, updatedCategory);
      toast({ title: 'Thành công', description: 'Cập nhật danh mục thành công' });
      fetchCategories();
      setEditingCategory(null);
      setFormDialogOpen(false);
    } catch (err: any) {
      toast({
        title: 'Lỗi',
        description: err.message || 'Cập nhật danh mục thất bại',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCategory(id);
      toast({ title: 'Thành công', description: 'Xóa danh mục thành công' });
      fetchCategories();
    } catch (err: any) {
      toast({
        title: 'Lỗi',
        description: err.message || 'Xóa danh mục thất bại',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      setCurrentPage(0);
      setSearchQuery(searchTerm);
      setTriggerSearch(true);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (!e.target.value.trim()) {
      setTriggerSearch(false);
      setSearchQuery('');
      setCurrentPage(0);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <svg className="animate-spin h-8 w-8 text-green-600 mr-3" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        <span className="text-gray-600 dark:text-gray-300">Đang tải...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 text-lg p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
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
      <Card className="bg-white dark:bg-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-green-700 dark:text-green-400">
            Quản lý danh mục
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Header: Thêm danh mục và tìm kiếm */}
          <div className="flex justify-between items-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => {
                  setEditingCategory(null);
                  setFormDialogOpen(true);
                }}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Thêm danh mục
              </Button>
            </motion.div>
            <div className="flex items-center space-x-4">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input
                  placeholder="Tìm kiếm danh mục..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onKeyDown={handleSearch}
                  className="pl-10 bg-white dark:bg-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <Badge
                variant="outline"
                className="px-3 py-1 text-green-600 dark:text-green-400 border-green-600 dark:border-green-400"
              >
                Tổng: {paginatedCategories?.totalElements || 0} danh mục
              </Badge>
            </div>
          </div>

          {/* Bảng danh mục */}
          <div className="overflow-x-auto">
            <Table className="w-full border-separate border-spacing-y-2">
              <TableHeader>
                <TableRow className="bg-gray-100 dark:bg-gray-700">
                  <TableHead className="text-gray-700 dark:text-gray-200 font-semibold">Tên</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-200 font-semibold">Mô tả</TableHead>
                  <TableHead className="text-center text-gray-700 dark:text-gray-200 font-semibold">
                    Hành động
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCategories?.content && paginatedCategories.content.length > 0 ? (
                  paginatedCategories.content.map((category) => (
                    <motion.tr
                      key={category.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <TableCell className="text-gray-800 dark:text-gray-200 py-3">{category.name}</TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-300 py-3">
                        {category.description || '-'}
                      </TableCell>
                      <TableCell className="text-center space-x-2 py-3">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingCategory(category);
                              setFormDialogOpen(true);
                            }}
                            className="border-green-600 text-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-gray-600"
                          >
                            Sửa
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setCategoryToDelete(category.id);
                              setDeleteDialogOpen(true);
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            Xóa
                          </Button>
                        </motion.div>
                      </TableCell>
                    </motion.tr>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-gray-500 dark:text-gray-400 py-6">
                      Không tìm thấy danh mục
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Phân trang */}
          <div className="flex justify-center space-x-2 mt-6">
            {Array.from({ length: paginatedCategories?.totalPages || 1 }, (_, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  variant={idx === currentPage ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePageChange(idx)}
                  className={`rounded-full w-10 h-10 ${
                    idx === currentPage
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

      {/* Dialog thêm/sửa danh mục */}
      <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
        <DialogContent className="max-w-2xl w-[90vw] max-h-[80vh] h-auto overflow-y-auto bg-white dark:bg-gray-800 rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-green-700 dark:text-green-400">
              {editingCategory ? 'Cập nhật danh mục' : 'Thêm danh mục mới'}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <CategoryForm
              onAddCategory={handleAddCategory}
              onUpdateCategory={handleUpdateCategory}
              editingCategory={editingCategory}
              setEditingCategory={setEditingCategory}
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
              Bạn có chắc chắn muốn xóa danh mục này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                className="border-green-600 text-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-gray-600"
              >
                Hủy
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="destructive"
                onClick={() => categoryToDelete && handleDelete(categoryToDelete)}
                className="bg-red-600 hover:bg-red-700 text-white"
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