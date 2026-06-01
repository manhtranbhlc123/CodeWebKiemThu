'use client';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { useState, useEffect } from 'react';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../../../components/ui/table';
import { Badge } from '../../../../components/ui/badge';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '../../../../components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { useToast } from '../../../../components/ui/use-toast';
import ProductForm from './ProductForm';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { getFruitsPaginated, deleteFruit, createFruit, updateFruit, searchFruits } from '@/app/admin/services/fruitService';
import { Fruit, FruitPOST, PaginatedFruits } from '../../types';
import { BaseURL } from '@/app/utils/baseUrl';

export default function ProductList() {
  const [mounted, setMounted] = useState(false);
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
    setMounted(true);
  }, []);

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
      const result = await getFruitsPaginated(currentPage, pageSize);
      
      // SỬA Ở ĐÂY: Dùng result.data thay vì result.data.data
      console.log("Cấu trúc result.data:", result.data); 
      setPaginatedFruits(result.data); 
      
      setError(null);
    } catch (err) {
      setError('Không thể tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const fetchSearchResults = async () => {
    setLoading(true);
    try {
      const result = await searchFruits(searchQuery, currentPage, pageSize,
        minPrice ? Number(minPrice) : undefined, maxPrice ? Number(maxPrice) : undefined);
      
      // SỬA TƯƠNG TỰ Ở ĐÂY
      setPaginatedFruits(result.data.data);
    } catch (err) {
      setError('Không thể tìm kiếm sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  // ... (Bạn dán các hàm handleAddProduct, handleUpdateProduct, handleDelete vào đây) ...

  const formatImportDate = (dateString: string | null | undefined) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return format(toZonedTime(date, 'Asia/Ho_Chi_Minh'), 'dd/MM/yyyy');
  };

  if (!mounted) return <div className="p-6">Đang tải...</div>;
  if (loading) return <div>Đang tải...</div>;

  return (
    <motion.div className="p-6 bg-gray-50 rounded-2xl">
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ảnh</TableHead>
                <TableHead>Tên</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Tồn kho</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedFruits?.content && paginatedFruits.content.length > 0 ? (
                paginatedFruits.content.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <img 
                        src={`${BaseURL.baseImage}${product.image}`} 
                        alt={product.name} 
                        width={48} 
                        height={48}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.price.toLocaleString()} VND</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">Không có sản phẩm nào</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}