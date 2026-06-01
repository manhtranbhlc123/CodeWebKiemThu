'use client';

import { useState, useEffect } from 'react';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Textarea } from '../../../../components/ui/textarea';
import { Badge } from '../../../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { useToast } from '../../../../components/ui/use-toast';
import { Fruit, Category, FruitPOST } from '../../types';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { parseISO } from 'date-fns';
import { getCategoriesPaginated } from '../../services/categoryService';
import { uploadFruitImage } from '../../services/fruitService';
import { motion } from 'framer-motion';
import { BaseURL } from '@/app/utils/baseUrl';

interface ProductFormProps {
  onAddProduct: (product: FruitPOST) => void;
  onUpdateProduct: (product: Fruit) => void;
  editingProduct: Fruit | null;
  setEditingProduct: (product: Fruit | null) => void;
}

export default function ProductForm({
  onAddProduct,
  onUpdateProduct,
  editingProduct,
  setEditingProduct,
}: ProductFormProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [origin, setOrigin] = useState('');
  const [weight, setWeight] = useState('');
  const [stockStatus, setStockStatus] = useState('');
  const [discount, setDiscount] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [importDate, setImportDate] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setPrice(editingProduct.price.toString());
      setQuantity(editingProduct.quantity.toString());
      setDescription(editingProduct.description);
      setImage(editingProduct.image);
      setTags(editingProduct.tags || []);
      setCategories(editingProduct.categories || []);
      setImportDate(editingProduct.importDate);
      setOrigin(editingProduct.origin);
      setWeight(editingProduct.weight.toString());
      setStockStatus(editingProduct.stockStatus);
      setDiscount(editingProduct.discount.toString());
      setSelectedCategory(editingProduct.categories[0] || null);
      setPreviewUrl(editingProduct.image ? `${editingProduct.image}` : '');
    } else {
      resetForm();
    }
  }, [editingProduct]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategoriesPaginated(0, 1000);
        setCategories(data.data.content);
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    };
    fetchCategories();
  }, []);

  const resetForm = () => {
    setName('');
    setPrice('');
    setQuantity('');
    setDescription('');
    setImage('');
    setTags([]);
    setNewTag('');
    setSelectedCategory(null);
    setImportDate('');
    setOrigin('');
    setWeight('');
    setStockStatus('');
    setDiscount('');
    setFile(null);
    setPreviewUrl('');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  };

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleOriginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[a-zA-Z\s\u00C0-\u1EF9]*$/.test(value)) {
      setOrigin(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({ title: 'Lỗi', description: 'Tên sản phẩm không được để trống', variant: 'destructive' });
      return;
    }
    if (!price.trim()) {
      toast({ title: 'Lỗi', description: 'Giá không được để trống', variant: 'destructive' });
      return;
    }
    if (!quantity.trim()) {
      toast({ title: 'Lỗi', description: 'Số lượng không được để trống', variant: 'destructive' });
      return;
    }
    if (!description.trim()) {
      toast({ title: 'Lỗi', description: 'Mô tả không được để trống', variant: 'destructive' });
      return;
    }
    if (!origin.trim()) {
      toast({ title: 'Lỗi', description: 'Xuất xứ không được để trống', variant: 'destructive' });
      return;
    }
    if (!/^[a-zA-Z\s\u00C0-\u1EF9]+$/.test(origin.trim())) {
      toast({ title: 'Lỗi', description: 'Xuất xứ chỉ được chứa chữ cái', variant: 'destructive' });
      return;
    }
    if (!weight.trim()) {
      toast({ title: 'Lỗi', description: 'Khối lượng không được để trống', variant: 'destructive' });
      return;
    }
    if (!stockStatus) {
      toast({ title: 'Lỗi', description: 'Vui lòng chọn trạng thái kho', variant: 'destructive' });
      return;
    }
    if (!importDate) {
      toast({ title: 'Lỗi', description: 'Ngày nhập không được để trống', variant: 'destructive' });
      return;
    }
    if (!selectedCategory) {
      toast({ title: 'Lỗi', description: 'Vui lòng chọn danh mục', variant: 'destructive' });
      return;
    }
    if (!editingProduct && !file) {
      toast({ title: 'Lỗi', description: 'Vui lòng chọn ảnh sản phẩm', variant: 'destructive' });
      return;
    }
    if (!discount.trim()) {
      toast({ title: 'Lỗi', description: 'Giảm giá không được để trống', variant: 'destructive' });
      return;
    }

    const priceValue = parseFloat(price);
    const quantityValue = parseInt(quantity);
    const discountValue = parseFloat(discount);
    const weightValue = parseFloat(weight);

    if (isNaN(priceValue) || isNaN(quantityValue) || isNaN(weightValue) || isNaN(discountValue)) {
      toast({ title: 'Lỗi', description: 'Giá, số lượng, khối lượng và giảm giá phải là số hợp lệ', variant: 'destructive' });
      return;
    }

    if (discountValue < 0 || discountValue > 1) {
      toast({ title: 'Lỗi', description: 'Giảm giá phải nằm trong khoảng từ 0 đến 1', variant: 'destructive' });
      return;
    }

    try {
      let uploadedImagePath = image;
      if (file) {
        const result = await uploadFruitImage(file);
        if (!result?.path) {
          throw new Error('Upload ảnh thất bại');
        }
        uploadedImagePath = result.path;
      }

      const product = {
        name,
        price: priceValue,
        quantity: quantityValue,
        description,
        image: uploadedImagePath,
        tags: tags || [],
        categories: selectedCategory ? [selectedCategory] : [],
        importDate,
        origin,
        weight: weightValue,
        stockStatus,
        discount: discountValue,
      };

      if (editingProduct) {
        await onUpdateProduct({ ...product, id: editingProduct.id } as Fruit);
      } else {
        await onAddProduct(product as FruitPOST);
      }

      resetForm();
      toast({
        title: 'Thành công',
        description: editingProduct ? 'Cập nhật sản phẩm thành công' : 'Thêm sản phẩm thành công',
      });
    } catch (err) {
      console.error('Lỗi khi xử lý sản phẩm:', err);
      toast({ title: 'Lỗi', description: 'Có lỗi xảy ra, vui lòng thử lại', variant: 'destructive' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl w-full h-full"
    >
      <Card className="bg-white dark:bg-gray-800 shadow-lg">
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Thông tin cơ bản</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tên sản phẩm <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nhập tên sản phẩm (ví dụ: Táo Fuji)"
                    className="mt-1 dark:bg-gray-700 dark:text-gray-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Giá (VND) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Nhập giá (ví dụ: 50000)"
                    className="mt-1 dark:bg-gray-700 dark:text-gray-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Số lượng <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Nhập số lượng (ví dụ: 100)"
                    className="mt-1 dark:bg-gray-700 dark:text-gray-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Giảm giá (0-1) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    placeholder="Nhập giảm giá (ví dụ: 0.1)"
                    min="0"
                    max="1"
                    step="0.01"
                    className="mt-1 dark:bg-gray-700 dark:text-gray-200"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Chi tiết sản phẩm */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Chi tiết sản phẩm</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Mô tả <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Mô tả chi tiết sản phẩm"
                    className="mt-1 h-32 dark:bg-gray-700 dark:text-gray-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tags
                  </label>
                  <div className="flex space-x-2 mt-1">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Nhập tag (ví dụ: Organic)"
                      className="dark:bg-gray-700 dark:text-gray-200"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={addTag}
                      className="bg-green-600 hover:bg-green-700 text-white rounded-full"
                    >
                      +
                    </Button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <motion.div
                        key={tag}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Badge
                          variant="secondary"
                          className="bg-green-500 text-white rounded-full cursor-pointer px-3 py-1"
                          onClick={() => removeTag(tag)}
                        >
                          {tag} <span className="ml-1">×</span>
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Xuất xứ <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={origin}
                    onChange={handleOriginChange}
                    placeholder="Nhập xuất xứ (ví dụ: Việt Nam)"
                    className="mt-1 dark:bg-gray-700 dark:text-gray-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Khối lượng (kg) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="Nhập khối lượng (ví dụ: 1.5)"
                    className="mt-1 dark:bg-gray-700 dark:text-gray-200"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Hình ảnh và danh mục */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Hình ảnh và danh mục</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Ảnh sản phẩm <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-1 dark:bg-gray-700 dark:text-gray-200"
                    required={!editingProduct}
                  />
                  {previewUrl && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4"
                    >
                      <img
                        src={previewUrl.includes("blob") ? previewUrl : `${BaseURL.baseImage}${previewUrl}`}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                      />
                    </motion.div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Danh mục <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedCategory?.name || ''}
                    onChange={(e) => {
                      const selected = categories.find((category) => category.name === e.target.value);
                      setSelectedCategory(selected || null);
                    }}
                    className="mt-1 w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:text-gray-200 focus:ring-green-500 focus:border-green-500"
                    required
                  >
                    <option value="" disabled>
                      Chọn danh mục
                    </option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Trạng thái kho <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={stockStatus}
                    onChange={(e) => setStockStatus(e.target.value)}
                    className="mt-1 w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:text-gray-200 focus:ring-green-500 focus:border-green-500"
                    required
                  >
                    <option value="" disabled>
                      Chọn trạng thái
                    </option>
                    <option value="IN_STOCK">Còn hàng</option>
                    <option value="OUT_OF_STOCK">Hết hàng</option>
                    <option value="LOW_STOCK">Sắp hết hàng</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Ngày nhập <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    selected={importDate ? parseISO(importDate) : null}
                    onChange={(date: Date | null) => {
                      if (date) {
                        setImportDate(date.toISOString());
                      } else {
                        setImportDate('');
                      }
                    }}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Chọn ngày nhập"
                    className="mt-1 w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:text-gray-200 focus:ring-green-500 focus:border-green-500"
                    maxDate={new Date()}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Nút hành động */}
            <div className="flex justify-end space-x-4">
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {editingProduct ? 'Cập nhật' : 'Thêm sản phẩm'}
                </Button>
              </motion.div>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}