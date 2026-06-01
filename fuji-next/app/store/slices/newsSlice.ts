import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BaseURL } from '@/app/utils/baseUrl';
import Token from '@/app/utils/token';

interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  image?: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  tags: string[];
}

interface RelatedArticle {
  id: number;
  title: string;
  slug: string;
  image?: string;
  date: string;
  excerpt: string;
  
}

interface News {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  category: string;
}

interface Category {
  name: string;
  count: number;
}

export interface NewsState {
  newsItems: News[];
  categories: Category[];
  selectedNews: News | null;
  article: Article | null;
  relatedArticles: RelatedArticle[];
  totalPages: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
}

const initialState: NewsState = {
  newsItems: [],
  categories: [],
  selectedNews: null,
  article: null,
  relatedArticles: [],
  totalPages: 1,
  currentPage: 1,
  loading: false,
  error: null,
};

export const fetchArticleBySlug = createAsyncThunk(
  'news/fetchArticleBySlug',
  async (slug: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BaseURL.news}/${slug}`);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue({ status: error.response.status, data: error.response.data });
      } else if (error.request) {
        return rejectWithValue({ status: 0, data: { message: 'Không thể kết nối đến server' } });
      } else {
        return rejectWithValue({ status: 0, data: { message: error.message } });
      }
    }
  }
);

// Async thunk để fetch bài viết liên quan
export const fetchRelatedArticles = createAsyncThunk(
  'news/fetchRelatedArticles',
  async ({ category, limit = 3, slug }: { category: string; limit?: number , slug?: string }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BaseURL.news}/related`, {
        params: { category, limit, slug },
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue({ status: error.response.status, data: error.response.data });
      } else if (error.request) {
        return rejectWithValue({ status: 0, data: { message: 'Không thể kết nối đến server' } });
      } else {
        return rejectWithValue({ status: 0, data: { message: error.message } });
      }
    }
  }
);

// Lấy danh sách tin tức
export const fetchNews = createAsyncThunk(
  'news/fetchNews',
  async ({ page, categoryId }: { page: number; categoryId?: number }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BaseURL.news}`, {
        params: { page: page - 1, size: 4, categoryId },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi lấy danh sách tin tức');
    }
  }
);

// Lấy danh mục tin tức
export const fetchCategories = createAsyncThunk(
  'news/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BaseURL.news}/categories`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi lấy danh mục tin tức');
    }
  }
);

// Lấy tin tức theo slug
export const fetchNewsBySlug = createAsyncThunk(
  'news/fetchNewsBySlug',
  async (slug: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BaseURL.news}/${slug}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi lấy tin tức');
    }
  }
);

// Tạo tin tức mới
export const createNews = createAsyncThunk(
  'news/createNews',
  async (newsData: Partial<News>, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BaseURL.news}/admin`, newsData, {
        headers: { Authorization: `Bearer ${Token.getAuthToken()}` },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi tạo tin tức');
    }
  }
);

// Cập nhật tin tức
export const updateNews = createAsyncThunk(
  'news/updateNews',
  async ({ id, newsData }: { id: number; newsData: Partial<News> }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BaseURL.news}/admin/${id}`, newsData, {
        headers: { Authorization: `Bearer ${Token.getAuthToken()}` },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi cập nhật tin tức');
    }
  }
);

// Xóa tin tức
export const deleteNews = createAsyncThunk(
  'news/deleteNews',
  async (id: number, { rejectWithValue }) => {
    try {
      await axios.delete(`${BaseURL.news}/admin/${id}`, {
        headers: { Authorization: `Bearer ${Token.getAuthToken()}` },
      });
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi xóa tin tức');
    }
  }
);

// Tìm kiếm tin tức
export const searchNews = createAsyncThunk(
  'news/searchNews',
  async (
    { title, page }: { title: string; page: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(`${BaseURL.news}/admin/search`, {
        params: { title, page: page - 1, size: 10 },
        headers: { Authorization: `Bearer ${Token.getAuthToken()}` },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi tìm kiếm tin tức');
    }
  }
);

// Tải ảnh lên
export const uploadNewsImage = createAsyncThunk(
  'news/uploadNewsImage',
  async (file: File, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post(`${BaseURL.news}/admin/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${Token.getAuthToken()}`,
        },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi tải ảnh lên');
    }
  }
);

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    clearArticle: (state) => {
      state.article = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Lấy danh sách tin tức
    builder
      .addCase(fetchNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.loading = false;
        // Sử dụng Optional Chaining để chống crash
        state.newsItems = action.payload?.content || action.payload || [];
        state.totalPages = action.payload?.totalPages || 1;
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Lấy danh mục
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload?.content || action.payload || [];
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Lấy tin tức theo slug
      .addCase(fetchNewsBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewsBySlug.fulfilled, (state, action) => {
        state.loading = false;
        // Sửa lỗi gọi .data 2 lần bằng cách fallback
        state.selectedNews = action.payload?.data || action.payload || null;
      })
      .addCase(fetchNewsBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Tạo tin tức
      .addCase(createNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNews.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.newsItems.push(action.payload);
        }
      })
      .addCase(createNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Cập nhật tin tức
      .addCase(updateNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNews.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.id) {
          const index = state.newsItems.findIndex((news) => news.id === action.payload.id);
          if (index !== -1) {
            state.newsItems[index] = action.payload;
          }
        }
      })
      .addCase(updateNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Xóa tin tức
      .addCase(deleteNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNews.fulfilled, (state, action) => {
        state.loading = false;
        state.newsItems = state.newsItems.filter((news) => news.id !== action.payload);
      })
      .addCase(deleteNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Tìm kiếm tin tức
      .addCase(searchNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchNews.fulfilled, (state, action) => {
        state.loading = false;
        state.newsItems = action.payload?.content || action.payload || [];
        state.totalPages = action.payload?.totalPages || 1;
      })
      .addCase(searchNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Tải ảnh lên
      .addCase(uploadNewsImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadNewsImage.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(uploadNewsImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch article by slug
      .addCase(fetchArticleBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticleBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.article = action.payload?.data || action.payload || null;
      })
      .addCase(fetchArticleBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as any)?.data?.message || 'Không thể tải bài viết';
      })
      
      // Fetch related articles
      .addCase(fetchRelatedArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRelatedArticles.fulfilled, (state, action) => {
        state.loading = false;
        // Bắt mọi trường hợp: nằm trong .data, .content, hoặc là array trực tiếp
        state.relatedArticles = action.payload?.data?.content || action.payload?.data || action.payload?.content || action.payload || [];
      })
      .addCase(fetchRelatedArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as any)?.data?.message || 'Không thể tải bài viết liên quan';
      });
  },
});

export const { setCurrentPage, clearArticle } = newsSlice.actions;
export default newsSlice.reducer;