"use client";
import { AdminTemplate } from "../components/template";
import CategoryList from "./components/CategoryList";

export default function CustomersPage() {
  return (
    <AdminTemplate>
      <CategoryList />
    </AdminTemplate>
  );
}
