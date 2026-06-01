import { BaseURL } from '@/app/utils/baseUrl';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Category } from './fruitSlice';
import { CheckoutPayload, Order } from '../types';
interface CartItem {
  id: number;
  fruitId: number;
  quantity: number;
  fruitName: string;
  fruitCategory: string;
  fruitPrice: number;
  fruitDiscount: number;
  image: string;
}

interface Cart {
  id: number;
  items: CartItem[];
}

interface CartState {
  cart: Cart | null;
  loading: boolean;
  checkoutResponse: any;
  error: string | null;
  cartLength: number;
}
interface UpdateResponse {
  fruitID: number;
}

const API_BASE_URL = BaseURL.cart;
const getAuthToken = (): string => {
  const token = Cookies.get('token');
  return token || '';
};
export const addToCart = createAsyncThunk<
  UpdateResponse,
  { fruitId: number; quantity: number, fruitName: string, fruitCategory: Category[], fruitPrice: number, image: string },
  { rejectValue: string }
>('cart/addToCart', async ({ fruitId, quantity, fruitName, fruitPrice, image }, { rejectWithValue }) => {
  try {
    const token = getAuthToken();
    if (!token) {
      return rejectWithValue('Vui lòng đăng nhập để thêm vào giỏ hàng');
    }

    const response = await axios.post(`${API_BASE_URL}/add`, { fruitId, quantity, fruitName, fruitPrice, image }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const newItem = {
      ...response.data.data,
      fruitID: fruitId
    };

    return newItem;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Lỗi khi thêm vào giỏ hàng');
  }
});

export const fetchCart = createAsyncThunk<Cart, void, { rejectValue: string }>(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) {
        return rejectWithValue('Vui lòng đăng nhập để xem giỏ hàng');
      }

      const response = await axios.get(API_BASE_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi lấy giỏ hàng');
    }
  }
);

export const plusCartItem = createAsyncThunk<UpdateResponse, number, { rejectValue: string }>(
  'cart/plusCartItem',
  async (fruitId, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) {
        return rejectWithValue('Vui lòng đăng nhập để cập nhật giỏ hàng');
      }

      const response = await axios.put(`${API_BASE_URL}/plus/${fruitId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const newItem = {
        ...response.data.data,
        fruitID: fruitId
      };

      return newItem;

    } catch (error: any) {
      console.log(error);

      return rejectWithValue(error.response?.data?.message || 'Lỗi khi tăng số lượng ');
    }
  }
);

export const minusCartItem = createAsyncThunk<UpdateResponse, number, { rejectValue: string }>(
  'cart/minusCartItem',
  async (fruitId, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) {
        return rejectWithValue('Vui lòng đăng nhập để cập nhật giỏ hàng');
      }

      const response = await axios.put(`${API_BASE_URL}/minus/${fruitId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const newItem = {
        ...response.data.data,
        fruitID: fruitId
      };

      return newItem;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi giảm số lượng');
    }
  }
);

export const removeCartItem = createAsyncThunk<UpdateResponse, number, { rejectValue: string }>(
  'cart/removeCartItem',
  async (fruitId, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) {
        return rejectWithValue('Vui lòng đăng nhập để xóa sản phẩm');
      }

      const response = await axios.delete(`${API_BASE_URL}/remove/${fruitId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const newItem = {
        ...response.data.data,
        fruitID: fruitId
      };

      return newItem;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi xóa sản phẩm');
    }
  }
);

export const clearCart = createAsyncThunk<void, void, { rejectValue: string }>(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) {
        return rejectWithValue('Vui lòng đăng nhập để xóa giỏ hàng');
      }
      const response = await axios.delete(`${API_BASE_URL}/clear`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi xóa giỏ hàng');
    }
  }
)

export const checkoutCart = createAsyncThunk<Order, CheckoutPayload, { rejectValue: string }>(
  'cart/checkoutCart',
  async (payload, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) {
        return rejectWithValue('Vui lòng đăng nhập để thanh toán');
      }
      const response = await axios.post(`${BaseURL.cart}/checkout`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi thanh toán');
    }
  }
);
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: null,
    checkoutResponse: null,
    loading: false,
    error: null,
  } as CartState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        if (state.cart?.items.some(item => item.fruitId === action.payload.fruitID)) {
          state.cartLength = state.cart.items.length;
        } else {
          state.cartLength += 1;
        }

      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unknown error';
      });

    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        state.cartLength = action.payload.items.length;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unknown error';
      });
    builder
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = null;
        state.cartLength = 0;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unknown error';
      });
    builder
      .addCase(plusCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(plusCartItem.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload);

        state.cart?.items.forEach((item) => {
          if (item.fruitId === action.payload.fruitID) {
            item.quantity += 1;
          }
        });

      })
      .addCase(plusCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unknown error';
      });

    builder
      .addCase(minusCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(minusCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.cart?.items.forEach((item) => {
          if (item.fruitId === action.payload.fruitID) {
            item.quantity -= 1;
          }
        });
      })
      .addCase(minusCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unknown error';
      });
    builder
      .addCase(removeCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload);

        if (state.cart) {
          state.cart.items = state.cart.items.filter((item) => item.fruitId !== action.payload.fruitID);
        }
        console.log(state.cart?.items);
        state.cartLength = state.cart?.items.length || 0;

      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unknown error';
      });

    builder.addCase(checkoutCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
      .addCase(checkoutCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = null;
        state.cartLength = 0;
        state.checkoutResponse = action.payload;
      })
      .addCase(checkoutCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unknown error';
      });
  },
});

export const { clearError } = cartSlice.actions;
export default cartSlice.reducer;

export type { CartItem, Cart, CartState };