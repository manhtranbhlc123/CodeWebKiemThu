import { BaseURL } from '@/app/utils/baseUrl';
import Token from '@/app/utils/token';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
interface Fruit {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface OrderItem {
  id: number;
  fruit: Fruit;
  quantity: number;
  price: number;
}

interface User {
  id: number;
  username: string;
  email: string;
}

interface Order {
  id: number;
  user?: User;
  userId?: number;
  items: OrderItem[] | [];
  orderItems?: OrderItem[];
  orderDate: string | Date;
  totalAmount: number;
  status: string;
  shippingAddress: string;
  paymentMethod: string;
  recipientName?: string;
  phoneNumber?: string;
}

interface OrderInput {
  orderDate: Date;
  totalAmount: number;
  status: string;
  shippingAddress: string;
  paymentMethod: string;
  userId: number;
  orderItems?: OrderItem[];
}

export interface OrderState {
  order: Order | null;
  orders: Order[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  error: string | null;
}

const initialState: OrderState = {
  order: null,
  orders: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
};

export const fetchOrder = createAsyncThunk(
  'order/fetchOrder',
  async (orderId: number, { rejectWithValue }) => {
    try {
      const token = Token.getAuthToken();
      if (!token) {
        return rejectWithValue('Vui lòng đăng nhập để tiếp tục.');
      }
      const response = await axios.get(`${BaseURL.order}/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || `Không tìm thấy đơn hàng với ID: ${orderId}`);
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'order/cancelOrder',
  async (orderId: number, { rejectWithValue }) => {
    try {
      const token = Token.getAuthToken();
      if (!token) {
        return rejectWithValue('Vui lòng đăng nhập để tiếp tục.');
      }
      await axios.put(`${BaseURL.order}/${orderId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return orderId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi hủy đơn hàng');
    }
  }
);
export  const fetchOrdersById = createAsyncThunk(
  'order/fetchOrdersById',
  async (userId: number, { rejectWithValue }) => {
    try {
      const token = Token.getAuthToken();
      if (!token) {
        return rejectWithValue('Vui lòng đăng nhập để tiếp tục.');
      }
      const response = await axios.get(`${BaseURL.order}/admin/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || `Không tìm thấy đơn hàng với ID: ${userId}`);
    }
  }
)

export const fetchOrders = createAsyncThunk(
  'order/fetchOrders',
  async ({ page, size }: { page: number; size: number }, { rejectWithValue }) => {
    try {
      const token = Token.getAuthToken();
      if (!token) {
        return rejectWithValue('Vui lòng đăng nhập với quyền admin.');
      }
      const response = await axios.get(`${BaseURL.order}/admin?page=${page}&size=${size}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể lấy danh sách đơn hàng');
    }
  }
);

export const addOrder = createAsyncThunk(
  'order/addOrder',
  async (order: OrderInput, { rejectWithValue }) => {
    try {
      const token = Token.getAuthToken();
      if (!token) {
        return rejectWithValue('Vui lòng đăng nhập với quyền admin.');
      }
      const response = await axios.post(`${BaseURL.order}/admin`, order, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể thêm đơn hàng');
    }
  }
);

export const updateOrder = createAsyncThunk(
  'order/updateOrder',
  async (order: Order, { rejectWithValue }) => {
    try {
      const token = Token.getAuthToken();
      if (!token) {
        return rejectWithValue('Vui lòng đăng nhập với quyền admin.');
      }
      const response = await axios.put(`${BaseURL.order}/admin/${order.id}`, order, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể cập nhật đơn hàng');
    }
  }
);
export const updateOrderStatus = createAsyncThunk(
  'order/updateOrderStatus',
  async (order: Order, { rejectWithValue }) => {
    try {
      const token = Token.getAuthToken();
      if (!token) {
        return rejectWithValue('Vui lòng đăng nhập với quyền admin.');
      }
      const response = await axios.put(
        `${BaseURL.order}/admin/${order.id}/status?status=${encodeURIComponent(order.status)}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.data; 
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể cập nhật trạng thái đơn hàng');
    }
  }
);
export const deleteOrder = createAsyncThunk(
  'order/deleteOrder',
  async (id: number, { rejectWithValue }) => {
    try {
      const token = Token.getAuthToken();
      if (!token) {
        return rejectWithValue('Vui lòng đăng nhập với quyền admin.');
      }
      await axios.delete(`${BaseURL.order}/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể xóa đơn hàng');
    }
  }
);
export const exportOrdersToExcel = createAsyncThunk(
  'order/exportOrdersToExcel',
  async (_, { rejectWithValue }) => {
    try {
      const token = Token.getAuthToken();
      if (!token) {
        return rejectWithValue('Vui lòng đăng nhập với quyền admin.');
      }
      const response = await axios.get(`${BaseURL.order}/admin/export`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể xuất Excel');
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
     setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
   
    builder
      .addCase(fetchOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

   
    builder
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        if (state.order && state.order.id === action.payload) {
          state.order.status = 'CANCELLED';
        }
       
        state.orders = state.orders.map((o) =>
          o.id === action.payload ? { ...o, status: 'CANCELLED' } : o
        );
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

   
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.content;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

   
    builder
      .addCase(addOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload);
      })
      .addCase(addOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

   
    builder
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.map((o) =>
          o.id === action.payload.id ? action.payload : o
        );
        if (state.order && state.order.id === action.payload.id) {
          state.order = action.payload;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

   
    builder
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.filter((o) => o.id !== action.payload);
        if (state.order && state.order.id === action.payload) {
          state.order = null;
        }
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    builder
      .addCase(fetchOrdersById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdersById.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.content;
      })
      .addCase(fetchOrdersById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = orderSlice.actions;
export default orderSlice.reducer;