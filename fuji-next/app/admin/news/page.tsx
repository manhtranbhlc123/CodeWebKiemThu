"use client";
import { AdminTemplate } from "../components/template";
import NewsList from "./components/NewsList";
import { useState } from "react";

export default function NewsPage() {
  const [categories, setCategories] = useState([
    { id: 1, name: "Công nghệ" },
    { id: 2, name: "Blog" },
    { id: 3, name: "Kinh doanh" },
    { id: 4, name: "Giải trí" },
  ]);

  return (
    <AdminTemplate>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Quản lý Tin tức & Blog</h1>
        <NewsList/>
      </div>
    </AdminTemplate>
  );
}
