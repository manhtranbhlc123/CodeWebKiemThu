"use client";
import { AdminTemplate } from "../components/template";
import CustomerList from "./components/CustomerList";

export default function CustomersPage() {
  return (
    <AdminTemplate>
      <h1 className="text-2xl font-bold mb-6">Quản lý Khách hàng</h1>
      <CustomerList />
    </AdminTemplate>
  );
}
