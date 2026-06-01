"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ChangePasswordPage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập
    const loggedIn = localStorage.getItem("isLoggedIn") === "true"

    if (!loggedIn) {
      router.push("/login")
      return
    }

    setIsLoggedIn(loggedIn)
  }, [router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Kiểm tra mật khẩu mới và xác nhận mật khẩu
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu mới và xác nhận mật khẩu không khớp")
      return
    }

    // Giả lập đổi mật khẩu thành công
    setTimeout(() => {
      setSuccess("Đổi mật khẩu thành công!")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    }, 1000)
  }

  if (!isLoggedIn) {
    return null // Sẽ chuyển hướng trong useEffect
  }

  return (
    <div className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-[#269300]">Đổi mật khẩu</h1>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
              )}

              {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">
                    Mật khẩu hiện tại
                  </label>
                  <input
                    type="password"
                    id="current-password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#269300] focus:border-[#269300]"
                    placeholder="Nhập mật khẩu hiện tại"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                    Mật khẩu mới
                  </label>
                  <input
                    type="password"
                    id="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#269300] focus:border-[#269300]"
                    placeholder="Nhập mật khẩu mới"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                    Xác nhận mật khẩu mới
                  </label>
                  <input
                    type="password"
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#269300] focus:border-[#269300]"
                    placeholder="Nhập lại mật khẩu mới"
                    required
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#269300] text-white py-2 px-4 rounded-md hover:bg-[#328615] transition duration-200"
                  >
                    Đổi mật khẩu
                  </button>
                </div>
              </form>

              <div className="mt-6 text-sm text-gray-600">
                <p>Lưu ý:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Mật khẩu phải có ít nhất 8 ký tự</li>
                  <li>Nên bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt</li>
                  <li>Không sử dụng thông tin cá nhân dễ đoán như ngày sinh</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

