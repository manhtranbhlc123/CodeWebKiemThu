"use client"

import { Bell, User } from "lucide-react"

export function AdminHeader() {
  return (
    <header className="bg-white shadow-sm h-16 flex items-center px-4 md:px-6">
      <div className="flex-1"></div>
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Bell size={20} />
        </button>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <User size={16} />
          </div>
          <span className="hidden md:inline-block font-medium">Admin</span>
        </div>
      </div>
    </header>
  )
}

