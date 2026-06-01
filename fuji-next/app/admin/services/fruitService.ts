import axios from "axios";
import { handleAxiosError } from "./errorHandler";
import { BaseURL } from "@/app/utils/baseUrl";
import { Fruit, FruitPOST } from "../types";

const baseUrl = BaseURL.base;

// Helper: Tạo headers có token
function getAuthHeaders(contentType: string = "application/json"): Record<string, string> {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {
    "Content-Type": contentType,
    Accept: "*/*",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

// ---------- Fruits ----------

// Lấy danh sách không phân trang
export async function getFruits() {
  const res = await fetch(`${baseUrl}/fruits`);
  if (!res.ok) throw new Error("Failed to fetch fruits");
  return res.json();
}

// Lấy danh sách có phân trang
export async function getFruitsPaginated(page = 0, size = 10) {
  try {
    const res = await axios.get(`${baseUrl}/fruits?page=${page}&size=${size}`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error) {
    handleAxiosError(error, "fetch fruits");
  }
}

// Tìm kiếm hoa quả
export async function searchFruits(name: string, page = 0, size = 1000,minPrice?: number, maxPrice?: number) {
  try {
    const res = await axios.get(`${baseUrl}/fruits/search`, {
      headers: getAuthHeaders(),
      params: { name, page, size, minPrice, maxPrice },
    });
    console.log(res.data);
    
    return res.data;
  } catch (error) {
    handleAxiosError(error, "search fruits");
  }
}

// Thêm hoa quả mới
export async function createFruit(product: FruitPOST) {
  try {
    const res = await axios.post(`${baseUrl}/fruits`, product, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error) {
    handleAxiosError(error, "create fruit");
  }
}

// Cập nhật hoa quả
export async function updateFruit(id: number, product: Fruit) {
  try {
    const res = await axios.put(`${baseUrl}/fruits/${id}`, product, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error) {
    handleAxiosError(error, "update fruit");
  }
}

// Xóa hoa quả
export async function deleteFruit(id: number) {
  try {
    const res = await axios.delete(`${baseUrl}/fruits/${id}`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error) {
    handleAxiosError(error, "delete fruit");
  }
}

// Upload ảnh
export async function uploadFruitImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await axios.post(`${baseUrl}/fruits/upload`, formData, {
      headers: getAuthHeaders("multipart/form-data"),
    });

    const { data } = res;
    return typeof data === "string" ? { path: data } :
           data?.data ? { path: data.data } :
           data?.path ? data :
           (() => { throw new Error("Invalid image response format"); })();
  } catch (error) {
    handleAxiosError(error, "upload image");
  }
}
