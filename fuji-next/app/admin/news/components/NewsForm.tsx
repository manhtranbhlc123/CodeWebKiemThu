"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { useToast } from "../../../../components/ui/use-toast";
import { Loader2, Upload } from "lucide-react";
import {
  createNews,
  updateNews,
  uploadNewsImage,
  NewsState,
} from "@/app/store/slices/newsSlice";
import { BaseURL } from "@/app/utils/baseUrl";

// Danh sách danh mục cố định
const FIXED_CATEGORIES = [
  "Tin tức",
  "Khuyến mãi",
  "Mẹo vặt",
  "Sản phẩm mới",
  
];

interface NewsFormProps {
  editingNews: NewsState["newsItems"][0] | null;
  setEditingNews: (news: NewsState["newsItems"][0] | null) => void;
  onClose: () => void;
}

export default function NewsForm({ editingNews, setEditingNews, onClose }: NewsFormProps) {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<string | undefined>(undefined);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

 
  useEffect(() => {
    if (editingNews) {
      setTitle(editingNews.title);
      setSlug(editingNews.slug);
      setExcerpt(editingNews.excerpt);
      setContent(editingNews.content || "");
      
      setCategory(editingNews.category);
      console.log(`CATEGORY: ${editingNews.category}`);
      
      setImage(`${BaseURL.baseImage}/images/${editingNews.image}`);
      setImageFile(null);
    } else {
      resetForm();
    }
  }, [editingNews]);

 
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!title) newErrors.title = "Tiêu đề là bắt buộc";
    if (!slug) newErrors.slug = "Slug là bắt buộc";
    if (!excerpt.trim()) newErrors.excerpt = "Tóm tắt là bắt buộc";
    if (!content.trim()) newErrors.content = "Nội dung là bắt buộc";
    if (!category) newErrors.category = "Danh mục là bắt buộc";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Lỗi",
          description: "Vui lòng chọn file hình ảnh",
          variant: "destructive",
        });
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      let imageUrl = image;

     
      if (imageFile) {
        try {
          const result = await dispatch(uploadNewsImage(imageFile) as any).unwrap();
          imageUrl = result;
        } catch (error) {
          toast({
            title: "Lỗi",
            description: "Không thể tải ảnh lên",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
      }

      const newsData = {
        title,
        slug,
        excerpt,
        content,
        image: imageUrl,
        category,
      };

     
      if (editingNews) {
        await dispatch(
          updateNews({ id: editingNews.id, newsData }) as any
        ).unwrap();
        toast({
          title: "Thành công",
          description: "Bài viết đã được cập nhật thành công",
        });
      } else {
        await dispatch(createNews(newsData) as any).unwrap();
        toast({
          title: "Thành công",
          description: "Bài viết đã được thêm thành công",
        });
      }
      onClose();
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể lưu bài viết",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setExcerpt("");
    setContent("");
    setCategory("");
    setImage(undefined);
    setImageFile(null);
    setErrors({});
    setEditingNews(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Tiêu đề</label>
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nhập tiêu đề bài viết"
          className={errors.title ? "border-red-500" : ""}
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Slug</label>
        <Input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="Nhập slug (ví dụ: tin-tuc-2025)"
          className={errors.slug ? "border-red-500" : ""}
        />
        {errors.slug && (
          <p className="text-sm text-red-500">{errors.slug}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Tóm tắt</label>
        <Textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Nhập tóm tắt bài viết..."
          rows={4}
          className={errors.excerpt ? "border-red-500" : ""}
        />
        {errors.excerpt && (
          <p className="text-sm text-red-500">{errors.excerpt}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Nội dung</label>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Nhập nội dung bài viết..."
          rows={8}
          className={errors.content ? "border-red-500" : ""}
        />
        {errors.content && (
          <p className="text-sm text-red-500">{errors.content}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Danh mục</label>
        <Select
          value={category.toString()}
          onValueChange={(value) => {
            if (value) {
              setCategory(value);
            }
          }}
        >
          <SelectTrigger className={errors.category ? "border-red-500" : ""}>
            <SelectValue placeholder="Chọn danh mục" />
          </SelectTrigger>
          <SelectContent>
            {FIXED_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-sm text-red-500">{errors.category}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Hình ảnh đại diện</label>
        <div className="flex items-center space-x-4">
          <Button type="button" variant="outline" asChild>
            <label htmlFor="image-upload">
              <Upload className="w-4 h-4 mr-2" /> Tải lên hình ảnh
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </Button>
          {image && (
            <img
              src={`${image}`}
              alt="Preview"
              className="object-cover w-16 h-16 rounded"
            />
          )}
        </div>
      </div>

      <div className="flex space-x-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : null}
          {editingNews ? "Cập nhật" : "Thêm bài viết"}
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Hủy
        </Button>
      </div>
    </form>
  );
}