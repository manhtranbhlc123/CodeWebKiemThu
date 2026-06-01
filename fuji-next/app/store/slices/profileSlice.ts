import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BaseURL } from '@/app/utils/baseUrl';
import Token from '@/app/utils/token';

interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  birthdate: string;
}

export interface Order {
  user:User;
  id: number;
  orderDate: string;
  totalAmount: number;
  status: string;
  shippingAddress: string;
  paymentMethod: string;
  paymentStatus: string;
  recipientName?: string;
  phoneNumber?: string;
  items: {
    id: number;
    fruit: {
      id: number;
      name: string;
      quantity: number;
      price: number;
      image: string;
    };
    quantity: number;
    price: number;
  }[];
}

export interface ProfileState {
  user: User | null;
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  user: null,
  orders: [],
  loading: false,
  error: null,
};

export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const token = Token.getAuthToken();
      if (!token) {
        return rejectWithValue('Vui lòng đăng nhập để tiếp tục.');
      }
      const response = await axios.get(`${BaseURL.user}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi lấy thông tin cá nhân');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (profileData: Partial<User>, { rejectWithValue }) => {
    try {
        const token = Token.getAuthToken();
        if (!token) {
        return rejectWithValue('Vui lòng đăng nhập để tiếp tục.');
      }
      const response = await axios.put(`${BaseURL.user}/me`, profileData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi cập nhật thông tin cá nhân');
    }
  }
);

export const fetchOrders = createAsyncThunk(
  'profile/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
        const token = Token.getAuthToken();
        if (!token) {
        return rejectWithValue('Vui lòng đăng nhập để tiếp tục.');
      }
      const response = await axios.get(`${BaseURL.user}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi lấy lịch sử đơn hàng');
    }
  }
);
export const changePassword = createAsyncThunk(
  'profile/changePassword',
  async (
    passwordData: { currentPassword: string; newPassword: string; confirmPassword: string },
    { rejectWithValue }
  ) => {
    try {
      const token = Token.getAuthToken();
      if (!token) {
        return rejectWithValue('Vui lòng đăng nhập để tiếp tục.');
      }
      await axios.put(`${BaseURL.user}/change-password`, passwordData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return null;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi đổi mật khẩu');
    }
  }
);
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.orders = [];
      state.error = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = profileSlice.actions;
export default profileSlice.reducer;