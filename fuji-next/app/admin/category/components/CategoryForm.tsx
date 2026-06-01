"use client";

import { useState, useEffect } from "react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";
import { useToast } from "../../../../components/ui/use-toast";
import { Category } from "../../types";

interface CategoryFormProps {
  onAddCategory: (category: Omit<Category, "id">) => void;
  onUpdateCategory: (category: Category) => void;
  editingCategory: Category | null;
  setEditingCategory: (category: Category | null) => void;
}

export default function CategoryForm({
  onAddCategory,
  onUpdateCategory,
  editingCategory,
  setEditingCategory,
}: CategoryFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name);
      setDescription(editingCategory.description || "");
    } else {
      resetForm();
    }
  }, [editingCategory]);

  const resetForm = () => {
    setName("");
    setDescription("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({
        title: "Lỗi",
        description: "Tên danh mục không được để trống",
        variant: "destructive",
      });
      return;
    }

    try {
      const category = {
        name: name.trim(),
        description: description.trim() || "", // Gửi chuỗi rỗng thay vì undefined
      };

      if (editingCategory) {
        await onUpdateCategory({ ...category, id: editingCategory.id });
      } else {
        await onAddCategory(category);
      }

      resetForm();
      setEditingCategory(null); // Đóng form sau khi thành công
      toast({
        title: "Thành công",
        description: editingCategory
          ? "Cập nhật danh mục thành công"
          : "Thêm danh mục thành công",
      });
    } catch (err: any) {
      console.error("Lỗi khi xử lý danh mục:", err);
      toast({
        title: "Lỗi",
        description: err.message || "Có lỗi xảy ra khi xử lý danh mục",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Tên danh mục *</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tên danh mục"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Mô tả</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Mô tả danh mục"
        />
      </div>
      <div className="flex space-x-4 justify-end">
        <Button type="submit">{editingCategory ? "Cập nhật" : "Thêm"}</Button>
      </div>
    </form>
  );
}
