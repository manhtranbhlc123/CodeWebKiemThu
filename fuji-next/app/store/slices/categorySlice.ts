import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BaseURL } from '@/app/utils/baseUrl';
interface Category {
  id: number;
  name: string;
  description: string | null;
}

interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

interface CategoryResponse {
  content: Category[];
  pageable: Pageable;
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  empty: boolean;
}

interface CategoryState {
  categories: Category[];
  pagination: {
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
    last: boolean;
    first: boolean;
  };
  loading: boolean;
  error: string | null;
}

const API_BASE_URL = BaseURL.category;
export const fetchAllCategories = createAsyncThunk<
  CategoryResponse,
  { page?: number; size?: number },
  { rejectValue: string }
>(
  'category/fetchAllCategories',
  async ({ page = 0, size = 10 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_BASE_URL, {
        params: { page, size },
      });
      return response.data?.data ?? response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const categorySlice = createSlice({
  name: 'category',
  initialState: {
    categories: [],
    pagination: {
      pageNumber: 0,
      pageSize: 10,
      totalPages: 1,
      totalElements: 0,
      last: true,
      first: true,
    },
    loading: false,
    error: null,
  } as CategoryState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.loading = false;
        
        // Console log để bạn tự kiểm tra xem Backend thực sự trả về cấu trúc gì
        // console.log("API Payload:", action.payload);

        // Sử dụng Optional Chaining (?.) và fallback array rỗng
        state.categories = action.payload?.content || action.payload || []; 
        
        // Bảo vệ an toàn cho object pagination
        state.pagination = {
          pageNumber: action.payload?.pageable?.pageNumber || action.payload?.number || 0,
          pageSize: action.payload?.pageable?.pageSize || action.payload?.size || 10,
          totalPages: action.payload?.totalPages || 1,
          totalElements: action.payload?.totalElements || state.categories.length,
          last: action.payload?.last ?? true,
          first: action.payload?.first ?? true,
        };
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unknown error';
      });
  },
});

// Export actions
export const { clearError } = categorySlice.actions;

// Export reducer
export default categorySlice.reducer;

// Export types để sử dụng trong các component
export type { Category, CategoryResponse, CategoryState };