"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type AdminContextType = {
  sidebarOpen: boolean
  toggleSidebar: () => void
}

const AdminContext = createContext<AdminContextType | null>(null)

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev)
  }

  return <AdminContext.Provider value={{ sidebarOpen, toggleSidebar }}>{children}</AdminContext.Provider>
}

