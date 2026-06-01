export interface Profile {
  name: string;
  email: string;
  address?: string;
}

export interface CartItem {
  id: number;
  product: string;
  quantity: number;
  price: number;
}

export interface CheckoutPayload {
  shippingAddress: string;
  paymentMethod: 'VNPAY' | 'COD';
  notes?: string;
  recipientName: string;
  phoneNumber: string;
}

export interface OrderItem {
  id: number;
  fruit: {
    id: number;
    name: string;
    price: number;
  };
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  orderDate: string;
  totalAmount: number;
  status: string;
  shippingAddress: string;
  paymentMethod: 'VNPAY' | 'COD';
  recipientName: string;
  phoneNumber: string;
  vnpTxnRef?: string;
  paymentStatus: string;
  paymentURL?: string;
  items: OrderItem[];
}
export interface OrderState {
  order: Order | null;
  loading: boolean;
  error: string | null;
}


// Định nghĩa kiểu cho User
export interface User {
  profile: Profile;
  cart: CartItem[];
  orders: Order[];
}
export interface VerifyState {
  status: "success";
  message: string;
  data: {
    username: string;
    roles: string[];
  };
}


// Định nghĩa kiểu cho Auth State
export interface AuthState {
  role: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Định nghĩa kiểu cho Cart State
export interface CartState {
  cart: CartItem[];
}

// Định nghĩa kiểu cho Profile State
export interface ProfileState {
  profile: Profile | null;
}

// Định nghĩa kiểu cho API response
export interface AuthResponse {
  token: string;
}

// Định nghĩa kiểu cho Credentials
export interface Credentials {
  username: string;
  password: string;
}
