'use client';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
import { useToast } from '../../../../components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../../components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import NewsForm from './NewsForm';
import { Search, Pencil, Trash2, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  fetchNews,
  deleteNews,
  searchNews,
  setCurrentPage,
  NewsState,
} from '@/app/store/slices/newsSlice';
import { RootState } from '@/app/store';

export default function NewsList() {
  const dispatch = useDispatch();
  const { newsItems, totalPages, currentPage, loading, error } = useSelector(
    (state: RootState) => state.new
  );
  const [editingNews, setEditingNews] = useState<NewsState['newsItems'][0] | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState<number | null>(null);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    dispatch(fetchNews({ page: currentPage, categoryId: undefined }) as any);
  }, [dispatch, currentPage]);

  // Xử lý lỗi từ Redux
  useEffect(() => {
    if (error) {
      toast({
        title: 'Lỗi',
        description: error,
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  // Xử lý xóa tin tức
  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteNews(id) as any).unwrap();
      toast({
        title: 'Thành công',
        description: 'Bài viết đã được xóa thành công',
      });
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa bài viết',
        variant: 'destructive',
      });
    }
    setDeleteDialogOpen(false);
    setNewsToDelete(null);
  };
  const openFormDialog = (news?: NewsState['newsItems'][0]) => {
    setEditingNews(news || null);
    setFormDialogOpen(true);
  };

  // Xử lý tìm kiếm khi nhấn Enter
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      dispatch(setCurrentPage(1)); // Reset về trang 1 khi tìm kiếm
      if (searchTerm.trim()) {
        dispatch(searchNews({ title: searchTerm, page: 1 }) as any);
      } else {
        dispatch(fetchNews({ page: 1, categoryId: undefined }) as any);
      }
    }
  };

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
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
  const formatImportDate = (dateString: string | null | undefined) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return format(toZonedTime(date, 'Asia/Ho_Chi_Minh'), 'dd/MM/yyyy');
  };
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
            Quản lý bài viết
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Header: Thêm bài viết và tìm kiếm */}
          <div className="flex items-center justify-between">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => openFormDialog()}
                className="text-white bg-green-600 hover:bg-green-700"
              >
                <Plus className="w-4 h-4 mr-1" /> Thêm bài viết
              </Button>
            </motion.div>
            <div className="flex items-center space-x-4">
              <div className="relative w-64">
                <Search className="absolute w-4 h-4 text-gray-500 transform -translate-y-1/2 left-3 top-1/2 dark:text-gray-400" />
                <Input
                  placeholder="Tìm kiếm bài viết (tiêu đề, danh mục...)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleSearch}
                  className="pl-10 bg-white border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <Badge
                variant="outline"
                className="px-3 py-1 text-green-600 border-green-600 dark:text-green-400 dark:border-green-400"
              >
                Tổng: {newsItems.length} bài viết
              </Badge>
            </div>
          </div>

          {/* Bảng bài viết */}
          <div className="overflow-x-auto">
            <Table className="w-full border-separate border-spacing-y-2">
              <TableHeader>
                <TableRow className="bg-gray-100 dark:bg-gray-700">
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-200">
                    Tiêu đề
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-200">
                    Danh mục
                  </TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-200 sıralı">
                    Ngày tạo
                  </TableHead>
                  <TableHead className="font-semibold text-center text-gray-700 dark:text-gray-200">
                    Hành động
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {newsItems.length > 0 ? (
                    newsItems.map((item: any) => (
                      <motion.tr
                        key={item.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="transition-colors bg-white rounded-lg shadow-sm dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <TableCell className="py-3 text-gray-800 dark:text-gray-200">
                          {item.title}
                        </TableCell>
                        <TableCell className="py-3 text-gray-600 dark:text-gray-300">
                          {item.category || '-'}
                        </TableCell>
                        <TableCell className="py-3 text-gray-600 dark:text-gray-300">
                          {formatImportDate(item.createdAt)}
                        </TableCell>
                        <TableCell className="py-3 space-x-2 text-center">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-block"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openFormDialog(item)}
                              className="text-green-600 border-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-gray-600"
                            >
                              <Pencil className="w-4 h-4 mr-1" /> Sửa
                            </Button>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-block"
                          >
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                setNewsToDelete(item.id);
                                setDeleteDialogOpen(true);
                              }}
                              className="text-white bg-red-600 hover:bg-red-700"
                            >
                              <Trash2 className="w-4 h-4 mr-1" /> Xóa
                            </Button>
                          </motion.div>
                        </TableCell>
                      </motion.tr>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="py-6 text-center text-gray-500 dark:text-gray-400"
                      >
                        Không tìm thấy bài viết
                      </TableCell>
                    </TableRow>
                  )}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>

          {/* Phân trang */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
                <motion.div
                  key={page}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    variant={page === currentPage ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className={`rounded-full w-10 h-10 ${
                      page === currentPage
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'border-green-600 text-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-gray-600'
                    }`}
                  >
                    {page}
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog cho thêm/chỉnh sửa tin tức */}
      <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
        <DialogContent className="max-w-2xl w-[90vw] max-h-[80vh] h-auto overflow-y-auto bg-white dark:bg-gray-800 rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-green-700 dark:text-green-400">
              {editingNews ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'}
            </DialogTitle>
          </DialogHeader>
          <NewsForm
            editingNews={editingNews}
            setEditingNews={setEditingNews}
            onClose={() => setFormDialogOpen(false)}
          />
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
              Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.
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
                onClick={() => newsToDelete && handleDelete(newsToDelete)}
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