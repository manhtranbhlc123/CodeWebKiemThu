import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BaseURL } from '@/app/utils/baseUrl';
import Cookies from 'js-cookie';

interface Customer {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
}

interface Order {
  id: number;
  orderDate: string;
  totalAmount: number;
  status: string;
  shippingAddress: string;
  paymentMethod: string;
  recipientName?: string;
  phoneNumber?: string;
}

interface CustomerState {
  customers: Customer[];
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: CustomerState = {
  customers: [],
  orders: [],
  loading: false,
  error: null,
};

export const fetchCustomers = createAsyncThunk(
  'customer/fetchCustomers',
  async ({ page, size }: { page: number; size: number }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BaseURL.user}/admin?page=${page}&size=${size}`, {
        headers: { Authorization: `Bearer ${Cookies.get('token')}` },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể lấy danh sách khách hàng');
    }
  }
);

export const searchCustomers = createAsyncThunk(
  'customer/searchCustomers',
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BaseURL.user}/admin/search?query=${query}`, {
        headers: { Authorization: `Bearer ${Cookies.get('token')}` },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tìm kiếm khách hàng');
    }
  }
);

export const deleteCustomer = createAsyncThunk(
  'customer/deleteCustomer',
  async (id: number, { rejectWithValue }) => {
    try {
      await axios.delete(`${BaseURL.user}/admin/${id}`, {
        headers: { Authorization: `Bearer ${Cookies.get('token')}` },
      });
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể xóa khách hàng');
    }
  }
);

export const resetCustomerPassword = createAsyncThunk(
  'customer/resetCustomerPassword',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BaseURL.user}/admin/${id}/reset-password`, null, {
        headers: { Authorization: `Bearer ${Cookies.get('token')}` },
      });
      return { id, newPassword: response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể reset mật khẩu');
    }
  }
);

export const fetchCustomerOrders = createAsyncThunk(
  'customer/fetchCustomerOrders',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BaseURL.user}/admin/orders/${userId}`, {
        headers: { Authorization: `Bearer ${Cookies.get('token')}` },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể lấy danh sách đơn hàng');
    }
  }
);

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(searchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload;
      })
      .addCase(searchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(deleteCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = state.customers.filter((c) => c.id !== action.payload);
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(resetCustomerPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetCustomerPassword.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(resetCustomerPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchCustomerOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerOrders.fulfilled, (state, action) => {
        state.loading = false;
        console.log(`Payload: ${action.payload}`);
        state.orders = action.payload;
      })
      .addCase(fetchCustomerOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = customerSlice.actions;
export default customerSlice.reducer;