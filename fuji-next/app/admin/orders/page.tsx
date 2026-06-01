'use client';

import { AdminTemplate } from "../components/template";
import OrderList from "./components/OrderList";

export default function OrdersPage() {
  return (
    <AdminTemplate>
      <h1 className="text-2xl font-bold mb-6">Quản lý Đơn hàng</h1>
      <OrderList />
    </AdminTemplate>
  );
}
