import { BaseURL } from '@/app/utils/baseUrl';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Định nghĩa các interface cho dữ liệu
interface Category {
  id: number;
  name: string;
  description: string | null;
}

interface Fruit {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  description: string;
  categories: Category[];
  tags: string[];
  importDate: string;
  origin: string;
  weight: number;
  stockStatus: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  averageRating: number;
  discount: number;
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

interface FruitResponse {
  content: Fruit[];
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

interface FruitState {
  fruits: Fruit[];
  selectedFruit: Fruit | null;
  pagination: {
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
    last: boolean;
    first: boolean;
  };
  relatedFruits: Fruit[];
  loading: boolean;
  error: string | null;
}

const API_BASE_URL = BaseURL.fruit;
export const fetchFruitById = createAsyncThunk<Fruit, number, { rejectValue: string }>(
  'fruit/fetchFruitById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`);
      return response.data?.data ?? response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const fetchAllFruits = createAsyncThunk<
  FruitResponse,
  { page?: number; size?: number },
  { rejectValue: string }
>(
  'fruit/fetchAllFruits',
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

// Async thunk để tìm kiếm hoa quả theo tên (phân trang)
// export const searchFruitsByName = createAsyncThunk<
//   FruitResponse,
//   { name: string; page?: number; size?: number },
//   { rejectValue: string }
// >(
//   'fruit/searchFruitsByName',
//   async ({ name, page = 0, size = 10 }, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/search`, {
//         params: { name, page, size },
//       });
//       return response.data.data;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || error.message);
//     }
//   }
// );
export const searchFruitsByName = createAsyncThunk<
  FruitResponse,
  {
    name?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    size?: number;
  },
  { rejectValue: string }
>(
  'fruit/searchFruits',
  async (
    { name, minPrice, maxPrice, page = 0, size = 10 },
    { rejectWithValue }
  ) => {
    try {
      const params: any = {
        page,
        size,
      };

      if (name?.trim()) params.name = name;
      if (minPrice !== undefined) params.minPrice = minPrice;
      if (maxPrice !== undefined) params.maxPrice = maxPrice;

      const response = await axios.get(`${API_BASE_URL}/search`, {
        params,
      });

      return response.data?.data ?? response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);


export const fetchFruitsByCategory = createAsyncThunk<
  FruitResponse,
  { categoryId: number, page?: number; size?: number },
  { rejectValue: string }
>(
  'fruit/fetchFruitsByCategory',
  async ({ categoryId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/category/${encodeURIComponent(categoryId)}`, {
        params: { page: 0, size: 10 },
      });
      console.log(response.data.data.content);

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const fetchRelatedFruits = createAsyncThunk(
  'fruit/fetchRelatedFruits',
  async ({ fruitId, page = 0, size = 4 }: { fruitId: number; page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/${fruitId}/related?page=${page}&size=${size}`
      );
      return response.data?.data ?? response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const fruitSlice = createSlice({
  name: 'fruit',
  initialState: {
    fruits: [],
    relatedFruits: [],
    selectedFruit: null,
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
  } as FruitState,
  reducers: {
    clearSelectedFruit: (state) => {
      state.selectedFruit = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Xử lý fetchFruitById
    builder
      .addCase(fetchFruitById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFruitById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedFruit = action.payload;
      })
      .addCase(fetchFruitById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unknown error';
      });

    // Xử lý fetchAllFruits
    builder
      .addCase(fetchAllFruits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllFruits.fulfilled, (state, action) => {
        state.loading = false;
        state.fruits = action.payload?.content || action.payload || [];
        state.pagination = {
          pageNumber: action.payload?.pageable?.pageNumber || action.payload?.number || 0,
          pageSize: action.payload?.pageable?.pageSize || action.payload?.size || 10,
          totalPages: action.payload?.totalPages || 1,
          totalElements: action.payload?.totalElements || state.fruits.length,
          last: action.payload?.last ?? true,
          first: action.payload?.first ?? true,
        };
      })
      .addCase(fetchAllFruits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unknown error';
      });

    // Xử lý searchFruitsByName
    builder
      .addCase(searchFruitsByName.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchFruitsByName.fulfilled, (state, action) => {
        state.loading = false;
        state.fruits = action.payload?.content || action.payload || [];
        state.pagination = {
          pageNumber: action.payload?.pageable?.pageNumber || action.payload?.number || 0,
          pageSize: action.payload?.pageable?.pageSize || action.payload?.size || 10,
          totalPages: action.payload?.totalPages || 1,
          totalElements: action.payload?.totalElements || state.fruits.length,
          last: action.payload?.last ?? true,
          first: action.payload?.first ?? true,
        };
      })
      .addCase(searchFruitsByName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unknown error';
      });

    // Xử lý fetchRelatedFruits
    builder
      .addCase(fetchRelatedFruits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRelatedFruits.fulfilled, (state, action) => {
        state.loading = false;
        state.relatedFruits = action.payload?.content || action.payload || [];
        state.pagination = {
          pageNumber: action.payload?.pageable?.pageNumber || action.payload?.number || 0,
          pageSize: action.payload?.pageable?.pageSize || action.payload?.size || 10,
          totalPages: action.payload?.totalPages || 1,
          totalElements: action.payload?.totalElements || state.relatedFruits.length,
          last: action.payload?.last ?? true,
          first: action.payload?.first ?? true,
        };
      })
      .addCase(fetchRelatedFruits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unknown error';
      });

    // Xử lý fetchFruitsByCategory
    builder
      .addCase(fetchFruitsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFruitsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.fruits = action.payload?.content || action.payload || [];
        state.pagination = {
          pageNumber: action.payload?.pageable?.pageNumber || action.payload?.number || 0,
          pageSize: action.payload?.pageable?.pageSize || action.payload?.size || 10,
          totalPages: action.payload?.totalPages || 1,
          totalElements: action.payload?.totalElements || state.fruits.length,
          last: action.payload?.last ?? true,
          first: action.payload?.first ?? true,
        };
      })
      .addCase(fetchFruitsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unknown error';
      });
  },
});

// Export actions
export const { clearSelectedFruit, clearError } = fruitSlice.actions;

// Export reducer
export default fruitSlice.reducer;

// Export types để sử dụng trong các component
export type { Fruit, Category, FruitResponse, FruitState };