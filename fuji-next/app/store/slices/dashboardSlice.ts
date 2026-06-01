import { BaseURL } from "@/app/utils/baseUrl";
import Token from "@/app/utils/token";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface DashboardStat {
    title: string;
    value: string;
    change?: string;
}

interface Order {
    id: string;
    customerName: string;
    totalAmount: string;
    createdAt: string;
    status: string;
}

interface RevenueData {
    totalRevenue: string;
    startDate: string | null;
    endDate: string | null;
    orderCount: number;
    averageOrderValue: string;
    revenueChange: string;
}

interface DashboardState {
    stats: DashboardStat[];
    recentOrders: Order[];
    revenue: RevenueData | null;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

interface FetchParams {
    startDate?: string;
    endDate?: string;
}

const initialState: DashboardState = {
    stats: [],
    recentOrders: [],
    revenue: null,
    status: "idle",
    error: null,
};
    
export const fetchRecentOrders = createAsyncThunk<
    Order[],
    FetchParams,
    { rejectValue: string }
>("dashboard/fetchRecentOrders", async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
        const token = Token.getAuthToken();
        if (!token) {
            return rejectWithValue("Vui lòng đăng nhập với quyền admin.");
        }
        const params: Record<string, string> = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;

        const response = await axios.get(`${BaseURL.statitic}/recent-orders`, {
            headers: { Authorization: `Bearer ${token}` },
            params,
        });
        const data = response.data.data;
        return data.map((order: any) => ({
            id: `#ORD-${String(order.id).padStart(3, "0")}`,
            customerName: order.recipientName,
            totalAmount: formatCurrency(order.totalAmount),
            createdAt: new Date(order.orderDate).toLocaleDateString("vi-VN"),
            status: order.status,
        }));
    } catch (error: any) {
        return rejectWithValue(
            error.response?.data?.message || "Không thể lấy danh sách đơn hàng gần đây"
        );
    }
});

export const fetchRevenue = createAsyncThunk<
    RevenueData,
    FetchParams,
    { rejectValue: string }
>("dashboard/fetchRevenue", async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
        const token = Token.getAuthToken();
        if (!token) {
            return rejectWithValue("Vui lòng đăng nhập với quyền admin.");
        }
        const params: Record<string, string> = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;

        const response = await axios.get(`${BaseURL.statitic}/revenue`, {
            headers: { Authorization: `Bearer ${token}` },
            params,
        });
        console.log("Revenue response:", response.data);
        return response.data.data;
    } catch (error: any) {
        return rejectWithValue(
            error.response?.data?.message || "Không thể lấy dữ liệu doanh thu"
        );
    }
});

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRecentOrders.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchRecentOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
                state.status = "succeeded";
                state.recentOrders = action.payload;
            })
            .addCase(fetchRecentOrders.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || "Lỗi không xác định";
            })
            .addCase(fetchRevenue.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchRevenue.fulfilled, (state, action: PayloadAction<RevenueData>) => {
                state.status = "succeeded";
                state.revenue = action.payload;
                const revenueStat = state.stats.find((stat) => stat.title === "Tổng doanh thu");
                if (revenueStat) {
                    revenueStat.value = action.payload.totalRevenue;
                    revenueStat.change = action.payload.revenueChange;
                }
            })
            .addCase(fetchRevenue.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || "Lỗi không xác định";
            });
    },
});

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
}

export default dashboardSlice.reducer;