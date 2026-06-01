"use client"

import type React from "react"

import { AdminProvider } from "../providers"
import { AdminSidebar } from "./sidebar"
import { AdminHeader } from "./header"

export function AdminTemplate({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <div className="min-h-screen bg-gray-100">
        <AdminSidebar />
        <div className="md:ml-64">
          <AdminHeader />
          <main className="p-4 md:p-6">{children}</main>
        </div>
      </div>
    </AdminProvider>
  )
}

