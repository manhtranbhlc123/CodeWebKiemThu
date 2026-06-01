"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminTemplate from "./components/template";
import { ShoppingCart, DollarSign } from "lucide-react";
import { AppDispatch, RootState } from "../store";
import {
  fetchRecentOrders,
  fetchRevenue,
} from "../store/slices/dashboardSlice";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Order {
  id: string;
  customerName: string;
  totalAmount: string;
  createdAt: string;
  status: string;
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

  const { recentOrders, revenue, status, error } = useSelector(
    (state: RootState) => state.dashboard
  );

  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  useEffect(() => {
    if (status === "idle" && startDate && endDate) {
      dispatch(
        fetchRecentOrders({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        })
      );

      dispatch(
        fetchRevenue({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        })
      );
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
      dispatch(
        fetchRecentOrders({
          startDate: start.toISOString(),
          endDate: end.toISOString(),
        })
      );

      dispatch(
        fetchRevenue({
          startDate: start.toISOString(),
          endDate: end.toISOString(),
        })
      );
    }
  };

  const calculateOrderChange = (orderCount: number) =>
    orderCount > 0 ? "+5.0%" : "0%";

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
      change: revenue?.orderCount
        ? calculateOrderChange(revenue.orderCount)
        : "0%",
    },
  ];

  return (
    <AdminTemplate>
      <div className="space-y-6">
        <div className="rounded-[2rem] border border-white/40 bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>

        <DatePicker
          selected={startDate}
          onChange={handleDateChange}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          isClearable
        />

        <div className="grid grid-cols-2 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="p-6 border rounded-xl">
              <h3>{stat.title}</h3>
              <p>{stat.value}</p>
              <p>{stat.change}</p>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <h2>Đơn hàng gần đây</h2>
          <table>
            <tbody>
              {recentOrders?.map((order: Order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customerName}</td>
                  <td>{order.totalAmount}</td>
                  <td>{getStatusText(order.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
    </AdminTemplate>
  );
}