"use client";
import { useDispatch, useSelector } from "react-redux";
import { AdminTemplate } from "./components/template";
import { ShoppingCart, DollarSign } from "lucide-react";
import { AppDispatch, RootState } from "../store";
import { fetchRecentOrders, fetchRevenue } from "../store/slices/dashboardSlice";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

const getStatusText = (status: string) => {
  switch (status) {
    case "PENDING":
      return "Đang chờ";
    case "PROCESSING":
      return "Đang xử lý";
    case "SHIPPED":
      return "Đã giao hàng";
    case "DELIVERED":
      return "Đã nhận hàng";
    case "CANCELLED":
      return "Đã hủy";
    default:
      return status;
  }
};

export default function AdminPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { recentOrders, revenue, status, error } = useSelector((state: RootState) => state.dashboard);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  useEffect(() => {
    if (status === "idle" && startDate && endDate) {
      dispatch(fetchRecentOrders({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      }));
      dispatch(fetchRevenue({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      }));
    }
  }, [status, dispatch, startDate, endDate]);

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    if (end && start && end < start) {
      alert("Ngày kết thúc không thể trước ngày bắt đầu");
      return;

    }
    setStartDate(start);
    setEndDate(end);

    if (start && end) {
      dispatch(fetchRecentOrders({
        
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      }));
      dispatch(fetchRevenue({
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      }));
    }
  };

  const statConfig: { [key: string]: { icon: any; color: string } } = {
    "Tổng doanh thu": { icon: DollarSign, color: "bg-blue-500" },
    "Đơn hàng": { icon: ShoppingCart, color: "bg-green-500" },
  };

  if (status === "loading") {
    return <AdminTemplate>Loading...</AdminTemplate>;
  }

  if (status === "failed") {
    return <AdminTemplate>Error: {error}</AdminTemplate>;
  }

  const stats = [
    {
      title: "Tổng doanh thu",
      value: revenue?.totalRevenue || "0 ₫",
      change: revenue?.revenueChange || "0%",
    },
    {
      title: "Đơn hàng",
      value: String(revenue?.orderCount || 0),
      change: revenue?.orderCount ? calculateOrderChange(revenue.orderCount) : "0%",
    },
  ];

  function calculateOrderChange(orderCount: number): string {
    return orderCount > 0 ? "+5.0%" : "0%";
  }

  return (
    <AdminTemplate>
      <div className="space-y-6">
        <div className="rounded-[2rem] border border-white/40 bg-gradient-to-r from-emerald-600 to-teal-600 p-6 shadow-2xl shadow-slate-900/10 text-white">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-2 text-sm text-emerald-100">Tổng quan hiệu suất kinh doanh và đơn hàng gần nhất.</p>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-xl">
          <div className="mb-6">
            <label className="block mb-3 text-sm font-semibold text-slate-700">Chọn khoảng thời gian</label>
            <DatePicker
              selected={startDate}
              onChange={handleDateChange}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              isClearable
              className="w-full max-w-md rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              placeholderText="Chọn ngày bắt đầu và kết thúc"
              dateFormat="dd/MM/yyyy"
            />
          </div>

      <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
        {stats.map((stat, index) => {
          const { icon: Icon, color } = statConfig[stat.title] || { icon: DollarSign, color: "bg-gray-500" };
          return (
            <div key={index} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-xl">
              <div className="flex items-center gap-4">
                <div className={`${color} p-3 rounded-2xl`}>
                  <Icon className="text-white" size={24} />
                </div>
                <div>
                  <p className="text-sm text-slate-500">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                  {stat.title === "Tổng doanh thu" && revenue && (
                    <div className="mt-2 text-sm text-slate-600">
                      <p>Số đơn: {revenue.orderCount}</p>
                      <p>Trung bình đơn: {revenue.averageOrderValue}</p>
                    </div>
                  )}
                  <p className={`mt-3 text-sm font-semibold ${stat.change?.startsWith("+") ? "text-emerald-600" : "text-rose-500"}`}>
                    {stat.change} so với tháng trước
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-xl">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Đơn hàng gần đây</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-slate-600 uppercase">
                  Mã đơn
                </th>
                <th className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-slate-600 uppercase">
                  Khách hàng
                </th>
                <th className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-slate-600 uppercase">
                  Ngày
                </th>
                <th className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-slate-600 uppercase">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-slate-600 uppercase">
                  Tổng tiền
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {recentOrders.length > 0 ? (
                recentOrders.map((order: Order) => (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm font-semibold text-emerald-700 whitespace-nowrap">{order.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-900 whitespace-nowrap">{order.customerName}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">{order.createdAt}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          order.status === "DELIVERED"
                            ? "bg-emerald-100 text-emerald-700"
                            : order.status === "SHIPPED"
                              ? "bg-sky-100 text-sky-700"
                              : order.status === "PROCESSING" || order.status === "PENDING"
                                ? "bg-amber-100 text-amber-700"
                                : order.status === "CANCELLED"
                                  ? "bg-rose-100 text-rose-700"
                                  : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-900 whitespace-nowrap">{order.totalAmount}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-sm text-center text-slate-500">
                    Không có đơn hàng gần đây
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
    </AdminTemplate>
  );
}