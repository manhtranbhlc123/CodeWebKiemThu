'use client';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AuthState, Credentials, AuthResponse, VerifyState } from '../types';
import Cookies from 'js-cookie';
import axios from 'axios';
import { BaseURL } from '@/app/utils/baseUrl';

export const register = createAsyncThunk<void, { username: string; password: string; email: string }, { rejectValue: string }>(
  'auth/register',
  async ({ username, password, email }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BaseURL.auth}/register`, {
        username,
        password,
        email,
      });
      if (res.status !== 200 && res.status !== 201) throw new Error('Đăng ký thất bại');
      return;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Đăng ký thất bại');
    }
  }
);

// Thunk để đăng nhập
export const login = createAsyncThunk<VerifyState, Credentials, { rejectValue: string }>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BaseURL.auth}/login`, {
        username: credentials.username,
        password: credentials.password,
      });
      if (res.status !== 200) throw new Error('Đăng nhập thất bại');
      const data: AuthResponse = await res.data.data;

      Cookies.set('token', data.token, { secure: true, sameSite: 'strict' });
      const resVerify = await axios.get(`${BaseURL.auth}/verify`, {
        headers: { Authorization: `Bearer ${data.token}` },
      });
      if (resVerify.status !== 200) throw new Error('Token không hợp lệ');
      return resVerify.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Đăng nhập thất bại');
    }
  }
);

// Thunk để lấy dữ liệu người dùng
export const fetchUserData = createAsyncThunk<VerifyState, void, { rejectValue: string }>(
  'auth/fetchUserData',
  async (_, { rejectWithValue }) => {
    const token = Cookies.get('token');
    if (!token) throw new Error('Chưa đăng nhập');
    try {
      const res = await axios.get(`${BaseURL.auth}/verify`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status !== 200) throw new Error('Token không hợp lệ');
      return await res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Lỗi khi tải dữ liệu người dùng');
    }
  }
);

// Thunk để kiểm tra xác thực khi khởi động
export const checkAuthOnStart = createAsyncThunk<VerifyState | null, void, { rejectValue: string }>(
  'auth/checkAuthOnStart',
  async (_, { rejectWithValue }) => {
    const token = Cookies.get('token');
    if (!token) return null; // Nếu không có token thì trả về null
    try {
      const res = await axios.get(`${BaseURL.auth}/verify`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status !== 200) throw new Error('Token không hợp lệ');
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Lỗi khi kiểm tra token');
    }
  }
);

// Thunk để đăng xuất
export const logoutAsync = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logoutAsync',
  async (_, { rejectWithValue }) => {
    const token = Cookies.get('token');
    if (!token) return; // Nếu không có token, không cần gọi API
    try {
      Cookies.remove('token');
    } catch (error: any) {
      Cookies.remove('token');
      return rejectWithValue(error.response?.data?.message || error.message || 'Lỗi khi đăng xuất');
    }
  }
);

const initialState: AuthState = {
  role: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      Cookies.remove('token');
      state.role = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.error = action.payload ?? 'Lỗi không xác định';
        state.loading = false;
      })
      // Check Auth on Start
      .addCase(checkAuthOnStart.fulfilled, (state, action) => {
        if (action.payload) {
          state.role = action.payload.data.roles[0];
          state.isAuthenticated = true;
        } else {
          state.role = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(checkAuthOnStart.rejected, (state, action) => {
        state.role = null;
        state.isAuthenticated = false;
        state.error = action.payload ?? 'Lỗi khi kiểm tra token';
      })
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.role = action.payload.data.roles[0];
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload ?? 'Lỗi không xác định';
        state.loading = false;
      })
      // Fetch User Data
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.role = action.payload.data.roles[0];
        state.isAuthenticated = true;
      })
      .addCase(fetchUserData.rejected, (state) => {
        state.isAuthenticated = false;
      })
      // Logout
      .addCase(logoutAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.loading = false;
      })
      .addCase(logoutAsync.rejected, (state, action) => {
        // Vẫn đăng xuất cục bộ ngay cả khi API thất bại
        state.isAuthenticated = false;
        state.loading = false;
        state.error = action.payload ?? 'Lỗi khi đăng xuất';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;