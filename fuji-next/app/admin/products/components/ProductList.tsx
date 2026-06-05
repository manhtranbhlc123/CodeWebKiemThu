
'use client';
 
import { useEffect, useMemo, useState } from 'react';

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
 
type SortMode = 'none' | 'priceAsc' | 'priceDesc';
 
export default function ProductList() {

  const [mounted, setMounted] = useState(false);

  const [paginatedFruits, setPaginatedFruits] = useState<PaginatedFruits | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);
 
  const [currentPage, setCurrentPage] = useState(0);

  const pageSize = 5;
 
  const [searchTerm, setSearchTerm] = useState('');

  const [searchQuery, setSearchQuery] = useState('');

  const [triggerSearch, setTriggerSearch] = useState(false);
 
  const [minPrice, setMinPrice] = useState('');

  const [maxPrice, setMaxPrice] = useState('');

  const [sortMode, setSortMode] = useState<SortMode>('none');
 
  const [formDialogOpen, setFormDialogOpen] = useState(false);

  const [editingProduct, setEditingProduct] = useState<Fruit | null>(null);
 
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [productToDelete, setProductToDelete] = useState<number | null>(null);
 
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);

  const [selectedHistory, setSelectedHistory] = useState<string[]>([]);
 
  const [featuredIds, setFeaturedIds] = useState<number[]>([]);

  const [inactiveIds, setInactiveIds] = useState<number[]>([]);
 
  const { toast } = useToast();
 
  useEffect(() => {

    setMounted(true);
 
    const savedFeatured = localStorage.getItem('featuredProductIds');

    const savedInactive = localStorage.getItem('inactiveProductIds');
 
    if (savedFeatured) {

      setFeaturedIds(JSON.parse(savedFeatured));

    }
 
    if (savedInactive) {

      setInactiveIds(JSON.parse(savedInactive));

    }

  }, []);
 
  useEffect(() => {

    if (!mounted) return;
 
    if (triggerSearch && searchQuery.trim()) {

      fetchSearchResults();

    } else {

      fetchFruits();

    }

  }, [mounted, currentPage, triggerSearch, searchQuery]);
 
  const normalizePageData = (raw: any): PaginatedFruits => {

    if (raw?.data?.data?.content) return raw.data.data;

    if (raw?.data?.content) return raw.data;

    if (raw?.content) return raw;

    return raw?.data || raw;

  };


  // Thêm hàm helper này
const getImageUrl = (imagePath) => {
  if (!imagePath) return '/placeholder.png'; // Thêm một ảnh mặc định trong thư mục public của bạn
  
  // Nếu database đã lưu sẵn URL đầy đủ (ví dụ: ảnh từ Cloudinary/S3), thì dùng luôn
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Nối URL của backend API (hãy đổi cái này thành URL thực tế của backend bạn)
  const backendBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'; 
  
  // Đảm bảo không bị thừa dấu gạch chéo
  return `${backendBaseUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};
 
  const fetchFruits = async () => {

    setLoading(true);
 
    try {

      const result = await getFruitsPaginated(currentPage, pageSize);

      const pageData = normalizePageData(result);
 
      setPaginatedFruits(pageData);

      setError(null);

    } catch (err) {

      console.error(err);

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

      const min = minPrice.trim() ? Number(minPrice) : undefined;

      const max = maxPrice.trim() ? Number(maxPrice) : undefined;
 
      if (min !== undefined && min < 0) {

        toast({

          title: 'Lỗi',

          description: 'Giá tối thiểu không được âm',

          variant: 'destructive',

        });

        setLoading(false);

        return;

      }
 
      if (max !== undefined && max < 0) {

        toast({

          title: 'Lỗi',

          description: 'Giá tối đa không được âm',

          variant: 'destructive',

        });

        setLoading(false);

        return;

      }
 
      if (min !== undefined && max !== undefined && min > max) {

        toast({

          title: 'Lỗi',

          description: 'Giá tối thiểu không được lớn hơn giá tối đa',

          variant: 'destructive',

        });

        setLoading(false);

        return;

      }
 
      const result = await searchFruits(searchQuery, currentPage, pageSize, min, max);

      const pageData = normalizePageData(result);
 
      setPaginatedFruits(pageData);

      setError(null);

    } catch (err) {

      console.error(err);

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
 
  const getContent = (): Fruit[] => {

    const data: any = paginatedFruits;
 
    if (!data) return [];

    if (Array.isArray(data)) return data;

    if (Array.isArray(data.content)) return data.content;

    if (Array.isArray(data.data?.content)) return data.data.content;
 
    return [];

  };
 
  const products = useMemo(() => {

    let list = getContent().filter((item) => !inactiveIds.includes(Number(item.id)));
 
    if (sortMode === 'priceAsc') {

      list = [...list].sort((a, b) => Number(a.price) - Number(b.price));

    }
 
    if (sortMode === 'priceDesc') {

      list = [...list].sort((a, b) => Number(b.price) - Number(a.price));

    }
 
    return list;

  }, [paginatedFruits, sortMode, inactiveIds]);
 
  const totalPages = Number((paginatedFruits as any)?.totalPages || 1);

  const pageNumber = Number(

    (paginatedFruits as any)?.number ??

      (paginatedFruits as any)?.pageNumber ??

      currentPage

  );
 
  const addHistory = (productId: number, message: string) => {

    const key = `productHistory_${productId}`;

    const oldHistory = JSON.parse(localStorage.getItem(key) || '[]');

    const nextHistory = [

      `${new Date().toLocaleString('vi-VN')}: ${message}`,

      ...oldHistory,

    ];
 
    localStorage.setItem(key, JSON.stringify(nextHistory));

  };
 
  const openHistory = (productId: number) => {

    const key = `productHistory_${productId}`;

    const history = JSON.parse(localStorage.getItem(key) || '[]');
 
    setSelectedHistory(history);

    setHistoryDialogOpen(true);

  };
 
  const handleSearch = () => {

    setCurrentPage(0);

    setSearchQuery(searchTerm);

    setTriggerSearch(Boolean(searchTerm.trim() || minPrice.trim() || maxPrice.trim()));
 
    if (!searchTerm.trim() && !minPrice.trim() && !maxPrice.trim()) {

      setTriggerSearch(false);

      fetchFruits();

    }

  };
 
  const handleResetSearch = () => {

    setSearchTerm('');

    setSearchQuery('');

    setMinPrice('');

    setMaxPrice('');

    setTriggerSearch(false);

    setSortMode('none');

    setCurrentPage(0);

  };
 
  const handleAddProduct = async (product: FruitPOST) => {

    try {

      await createFruit(product);
 
      toast({

        title: 'Thành công',

        description: 'Thêm sản phẩm thành công',

      });
 
      setFormDialogOpen(false);

      setEditingProduct(null);

      fetchFruits();

    } catch (err) {

      console.error(err);

      toast({

        title: 'Lỗi',

        description: 'Thêm sản phẩm thất bại',

        variant: 'destructive',

      });

    }

  };
 
  const handleUpdateProduct = async (product: Fruit) => {

    try {

      await updateFruit(product.id, product);

      addHistory(Number(product.id), 'Cập nhật thông tin sản phẩm');
 
      toast({

        title: 'Thành công',

        description: 'Cập nhật sản phẩm thành công',

      });
 
      setFormDialogOpen(false);

      setEditingProduct(null);

      fetchFruits();

    } catch (err) {

      console.error(err);

      toast({

        title: 'Lỗi',

        description: 'Cập nhật sản phẩm thất bại',

        variant: 'destructive',

      });

    }

  };
 
  const openAddDialog = () => {

    setEditingProduct(null);

    setFormDialogOpen(true);

  };
 
  const openEditDialog = (product: Fruit) => {

    setEditingProduct(product);

    setFormDialogOpen(true);

  };
 
  const openDeleteDialog = (id: number) => {

    setProductToDelete(id);

    setDeleteDialogOpen(true);

  };
 
  const handleDeleteProduct = async () => {

    if (productToDelete === null) return;
 
    try {

      await deleteFruit(productToDelete);

      addHistory(productToDelete, 'Xóa sản phẩm');
 
      toast({

        title: 'Thành công',

        description: 'Xóa sản phẩm thành công',

      });
 
      setDeleteDialogOpen(false);

      setProductToDelete(null);

      fetchFruits();

    } catch (err) {

      console.error(err);

      toast({

        title: 'Lỗi',

        description: 'Xóa sản phẩm thất bại',

        variant: 'destructive',

      });

    }

  };
 
  const handleToggleFeatured = (product: Fruit) => {

    const id = Number(product.id);

    const isFeatured = featuredIds.includes(id);
 
    const next = isFeatured

      ? featuredIds.filter((item) => item !== id)

      : [...featuredIds, id];
 
    setFeaturedIds(next);

    localStorage.setItem('featuredProductIds', JSON.stringify(next));

    addHistory(id, isFeatured ? 'Bỏ đặt nổi bật' : 'Đặt sản phẩm nổi bật');
 
    toast({

      title: 'Thành công',

      description: isFeatured

        ? 'Đã bỏ sản phẩm khỏi danh sách nổi bật'

        : 'Đã đặt sản phẩm nổi bật',

    });

  };
 
  const handleMarkInactive = (product: Fruit) => {

    const id = Number(product.id);
 
    if (inactiveIds.includes(id)) return;
 
    const next = [...inactiveIds, id];

    setInactiveIds(next);

    localStorage.setItem('inactiveProductIds', JSON.stringify(next));

    addHistory(id, 'Đánh dấu không bán');
 
    toast({

      title: 'Thành công',

      description: 'Đã đánh dấu sản phẩm không bán',

    });

  };
 
  const handleExportExcel = () => {

    const header = [

      'ID',

      'Tên sản phẩm',

      'Giá',

      'Số lượng',

      'Xuất xứ',

      'Khối lượng',

      'Trạng thái kho',

      'Giảm giá',

      'Nổi bật',

    ];
 
    const rows = products.map((item) => [

      item.id,

      item.name,

      item.price,

      item.quantity,

      item.origin,

      item.weight,

      item.stockStatus,

      item.discount,

      featuredIds.includes(Number(item.id)) ? 'Có' : 'Không',

    ]);
 
    const csvContent = [header, ...rows]

      .map((row) =>

        row

          .map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`)

          .join(',')

      )

      .join('\n');
 
    const blob = new Blob(['\uFEFF' + csvContent], {

      type: 'text/csv;charset=utf-8;',

    });
 
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
 
    link.href = url;

    link.download = `quan-ly-san-pham-${new Date().toISOString().slice(0, 10)}.csv`;

    link.click();
 
    URL.revokeObjectURL(url);
 
    toast({

      title: 'Thành công',

      description: 'Đã xuất file Excel/CSV danh sách sản phẩm',

    });

  };
 
  const formatCurrency = (value: number | string) => {

    return Number(value || 0).toLocaleString('vi-VN') + ' ₫';

  };
 
  if (!mounted) return null;
 
  return (
<motion.div

      initial={{ opacity: 0, y: 16 }}

      animate={{ opacity: 1, y: 0 }}

      transition={{ duration: 0.35 }}

      className="space-y-6"
>
<Card className="border-0 shadow-lg">
<CardHeader>
<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
<div>
<CardTitle className="text-2xl font-bold">

                Quản lý sản phẩm
</CardTitle>
<p className="mt-1 text-sm text-gray-500">

                Thêm, sửa, xóa, tìm kiếm, sắp xếp và xuất danh sách sản phẩm.
</p>
</div>
 
            <div className="flex flex-wrap gap-2">
<Button onClick={handleExportExcel} variant="outline">

                Xuất Excel
</Button>
 
              <Button onClick={openAddDialog}>

                Thêm sản phẩm
</Button>
</div>
</div>
</CardHeader>
 
        <CardContent className="space-y-5">
<div className="grid gap-3 lg:grid-cols-[1.2fr_0.7fr_0.7fr_auto]">
<div className="relative">
<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
<Input

                value={searchTerm}

                onChange={(e) => setSearchTerm(e.target.value)}

                placeholder="Tìm theo tên sản phẩm..."

                className="pl-9"

              />
</div>
 
            <Input

              type="number"

              min="0"

              value={minPrice}

              onChange={(e) => setMinPrice(e.target.value)}

              placeholder="Giá từ"

            />
 
            <Input

              type="number"

              min="0"

              value={maxPrice}

              onChange={(e) => setMaxPrice(e.target.value)}

              placeholder="Giá đến"

            />
 
            <div className="flex gap-2">
<Button onClick={handleSearch}>

                Tìm
</Button>
 
              <Button variant="outline" onClick={handleResetSearch}>

                Reset
</Button>
</div>
</div>
 
          <div className="flex flex-wrap gap-2">
<Button

              variant={sortMode === 'none' ? 'default' : 'outline'}

              onClick={() => setSortMode('none')}
>

              Mặc định
</Button>
 
            <Button

              variant={sortMode === 'priceAsc' ? 'default' : 'outline'}

              onClick={() => setSortMode('priceAsc')}
>

              Giá tăng dần
</Button>
 
            <Button

              variant={sortMode === 'priceDesc' ? 'default' : 'outline'}

              onClick={() => setSortMode('priceDesc')}
>

              Giá giảm dần
</Button>
</div>
 
          {error && (
<div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">

              {error}
</div>

          )}
 
          {loading ? (
<div className="rounded-xl border p-8 text-center text-gray-500">

              Đang tải danh sách sản phẩm...
</div>

          ) : (
<div className="overflow-x-auto rounded-xl border">
<Table>
<TableHeader>
<TableRow>
<TableHead>Ảnh</TableHead>
<TableHead>Tên sản phẩm</TableHead>
<TableHead>Giá</TableHead>
<TableHead>Tồn kho</TableHead>
<TableHead>Xuất xứ</TableHead>
<TableHead>Khối lượng</TableHead>
<TableHead>Trạng thái</TableHead>
<TableHead>Nổi bật</TableHead>
<TableHead className="text-right">Thao tác</TableHead>
</TableRow>
</TableHeader>
 
                <TableBody>

                  {products.length === 0 ? (
<TableRow>
<TableCell colSpan={9} className="py-8 text-center text-gray-500">

                        Không có sản phẩm nào
</TableCell>
</TableRow>

                  ) : (

                    products.map((product) => {

                      const isFeatured = featuredIds.includes(Number(product.id));
 
                      return (
<TableRow key={product.id}>
<TableCell className="w-24">
  <img
    src={getImageUrl(product.image)}
    alt={product.name}
    className="h-16 w-16 min-w-[4rem] rounded-lg object-cover aspect-square flex-shrink-0 border border-gray-100"
    onError={(e) => {
      e.currentTarget.src = 'https://placehold.co/100x100?text=No+Image'; // Hiển thị ảnh mặc định nếu backend bị mất file
    }}
  />
</TableCell>
 
                          <TableCell className="font-medium">

                            {product.name}
</TableCell>
 
                          <TableCell>

                            {formatCurrency(product.price)}
</TableCell>
 
                          <TableCell>

                            {product.quantity}
</TableCell>
 
                          <TableCell>

                            {product.origin || '-'}
</TableCell>
 
                          <TableCell>

                            {product.weight || '-'}
</TableCell>
 
                          <TableCell>
<Badge variant="outline">

                              {product.stockStatus || 'UNKNOWN'}
</Badge>
</TableCell>
 
                          <TableCell>

                            {isFeatured ? (
<Badge>Nổi bật</Badge>

                            ) : (
<Badge variant="outline">Thường</Badge>

                            )}
</TableCell>
 
                          <TableCell>
<div className="flex flex-wrap justify-end gap-2">
<Button

                                size="sm"

                                variant="outline"

                                onClick={() => openEditDialog(product)}
>

                                Sửa
</Button>
 
                              <Button

                                size="sm"

                                variant="outline"

                                onClick={() => handleToggleFeatured(product)}
>

                                {isFeatured ? 'Bỏ nổi bật' : 'Nổi bật'}
</Button>
 
                              <Button

                                size="sm"

                                variant="outline"

                                onClick={() => openHistory(Number(product.id))}
>

                                Lịch sử
</Button>
 
                              <Button

                                size="sm"

                                variant="outline"

                                onClick={() => handleMarkInactive(product)}
>

                                Không bán
</Button>
 
                              <Button

                                size="sm"

                                variant="destructive"

                                onClick={() => openDeleteDialog(Number(product.id))}
>

                                Xóa
</Button>
</div>
</TableCell>
</TableRow>

                      );

                    })

                  )}
</TableBody>
</Table>
</div>

          )}
 
          <div className="flex items-center justify-between">
<Button

              variant="outline"

              disabled={pageNumber <= 0}

              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
>

              Trang trước
</Button>
 
            <span className="text-sm text-gray-500">

              Trang {pageNumber + 1} / {totalPages}
</span>
 
            <Button

              variant="outline"

              disabled={pageNumber >= totalPages - 1}

              onClick={() => setCurrentPage((prev) => prev + 1)}
>

              Trang sau
</Button>
</div>
</CardContent>
</Card>
 
      <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
<DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto">
<DialogHeader>
<DialogTitle>

              {editingProduct ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}
</DialogTitle>
<DialogDescription>

              Nhập đầy đủ thông tin sản phẩm trước khi lưu.
</DialogDescription>
</DialogHeader>
 
          <ProductForm

            onAddProduct={handleAddProduct}

            onUpdateProduct={handleUpdateProduct}

            editingProduct={editingProduct}

            setEditingProduct={setEditingProduct}

          />
</DialogContent>
</Dialog>
 
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
<DialogContent>
<DialogHeader>
<DialogTitle>Xác nhận xóa sản phẩm</DialogTitle>
<DialogDescription>

              Bạn có chắc chắn muốn xóa sản phẩm này không? Hành động này không thể hoàn tác.
</DialogDescription>
</DialogHeader>
 
          <DialogFooter>
<Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>

              Hủy
</Button>
 
            <Button variant="destructive" onClick={handleDeleteProduct}>

              Xóa
</Button>
</DialogFooter>
</DialogContent>
</Dialog>
 
      <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
<DialogContent>
<DialogHeader>
<DialogTitle>Lịch sử thay đổi</DialogTitle>
<DialogDescription>

              Các thao tác đã thực hiện với sản phẩm.
</DialogDescription>
</DialogHeader>
 
          <div className="space-y-2">

            {selectedHistory.length === 0 ? (
<p className="text-sm text-gray-500">Chưa có lịch sử thay đổi.</p>

            ) : (

              selectedHistory.map((item, index) => (
<div key={index} className="rounded-lg border p-3 text-sm">

                  {item}
</div>

              ))

            )}
</div>
</DialogContent>
</Dialog>
</motion.div>

  );

}
 