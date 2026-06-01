"use client";

import React from "react";
import { AdminProvider } from "../providers";
import { AdminSidebar } from "./sidebar";
import { AdminHeader } from "./header";

type Props = {
  children: React.ReactNode;
};

export default function AdminTemplate({ children }: Props) {
  
  console.log({
    AdminProvider,
    AdminSidebar,
    AdminHeader,
  });


  return (
    <AdminProvider>
      <div className="min-h-screen bg-gray-100">
        <AdminSidebar />

        <div className="md:ml-64">
          <AdminHeader />

          

          <main className="p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </AdminProvider>
  );
}