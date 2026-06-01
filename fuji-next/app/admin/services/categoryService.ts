import axios from "axios";
import { handleAxiosError } from "./errorHandler";
import { BaseURL } from "@/app/utils/baseUrl";
import { Category } from "../types";

const baseUrl = BaseURL.base;

function getAuthHeaders(contentType = "application/json"): Record<string, string> {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {
    "Content-Type": contentType,
    Accept: "*/*",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

// Danh sách có phân trang
export async function getCategoriesPaginated(page = 0, size = 10) {
  try {
    const res = await axios.get(`${baseUrl}/categories`, {
      headers: getAuthHeaders(),
      params: { page, size },
    });
    return res.data;
  } catch (error) {
    handleAxiosError(error, "fetch categories");
  }
}

// Tạo danh mục mới
export async function createCategory(category: Omit<Category, "id">) {
  try {
    const payload = {
      name: category.name,
      description: category.description || "",
    };
    const res = await axios.post(`${baseUrl}/categories`, payload, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error) {
    handleAxiosError(error, "create category");
  }
}

// Cập nhật danh mục
export async function updateCategory(id: number, category: Category) {
  try {
    const res = await axios.put(`${baseUrl}/categories/${id}`, category, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error) {
    handleAxiosError(error, "update category");
  }
}

// Xóa danh mục
export async function deleteCategory(id: number) {
  try {
    const res = await axios.delete(`${baseUrl}/categories/${id}`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error) {
    handleAxiosError(error, "delete category");
  }
}
