"use client";

import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchProfile, updateProfile, fetchOrders, logout, ProfileState, Order, changePassword } from "@/app/store/slices/profileSlice";
import { AppDispatch, RootState } from "@/app/store";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Token from "@/app/utils/token";

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user, orders, loading, error } = useSelector<RootState, ProfileState>((state) => state.profile);
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
    birthdate: "",
  });
  const [errors, setErrors] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
    birthdate: "",
  });
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isOrderOverlayOpen, setIsOrderOverlayOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const token = Token.getAuthToken();
    if (!token) {
      toast.error("Vui lòng đăng nhập để tiếp tục.");
      router.push("/login");
      return;
    }
    dispatch(fetchProfile());
    dispatch(fetchOrders());
  }, [dispatch, router]);

  useEffect(() => {
    if (user) {
      setProfileForm({
        fullName: user.fullName || "",
        phoneNumber: user.phoneNumber || "",
        address: user.address || "",
        birthdate: user.birthdate ? user.birthdate.split("T")[0] : "",
      });
    }
  }, [user]);

  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  }, []);

  const formatDate = useCallback((date: string) => {
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(date));
  }, []);

  const statusMap: { [key: string]: string } = {
    PENDING: "Đang chờ",
    SHIPPED: "Đã giao",
    SHIPPING : "Đang giao",
    DELIVERED: "Đã nhận",
    CANCELLED: "Đã hủy",
    FAILED: "Thất bại",
    CONFIRMED: "Đã xác nhận",
    COMPLETED: "Hoàn thành",
  };

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }, []);

  const validateForm = useCallback(() => {
    let isValid = true;
    const newErrors = { fullName: "", phoneNumber: "", address: "", birthdate: "" };

    if (!profileForm.fullName.trim()) {
      newErrors.fullName = "Họ và tên là bắt buộc";
      isValid = false;
    } else if (profileForm.fullName.trim().length < 2) {
      newErrors.fullName = "Họ và tên phải có ít nhất 2 ký tự";
      isValid = false;
    }

    if (!profileForm.phoneNumber.trim()) {
      newErrors.phoneNumber = "Số điện thoại là bắt buộc";
      isValid = false;
    } else if (!/^\d{10}$/.test(profileForm.phoneNumber.trim())) {
      newErrors.phoneNumber = "Số điện thoại phải có đúng 10 chữ số";
      isValid = false;
    }

    if (!profileForm.address.trim()) {
      newErrors.address = "Địa chỉ là bắt buộc";
      isValid = false;
    } else if (profileForm.address.trim().length < 10) {
      newErrors.address = "Địa chỉ phải có ít nhất 10 ký tự";
      isValid = false;
    }

    if (profileForm.birthdate) {
      const birthdate = new Date(profileForm.birthdate);
      const today = new Date();
      if (birthdate > today) {
        newErrors.birthdate = "Ngày sinh không hợp lệ";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  }, [profileForm]);

  const handleUpdateProfile = useCallback(async () => {
    if (!validateForm()) {
      return;
    }
    try {
      await dispatch(updateProfile(profileForm)).unwrap();
      toast.success("Cập nhật thông tin cá nhân thành công!");
    } catch (err: any) {
      toast.error(err.message || "Lỗi khi cập nhật thông tin cá nhân");
    }
  }, [dispatch, profileForm, validateForm]);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    toast.success("Đăng xuất thành công!");
    router.push("/login");
  }, [dispatch, router]);

  const handlePasswordInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    setPasswordErrors((prev) => ({ ...prev, [name]: "" }));
  }, []);

  const validatePasswordForm = useCallback(() => {
    let isValid = true;
    const newErrors = { currentPassword: "", newPassword: "", confirmPassword: "" };

    if (!passwordForm.currentPassword.trim()) {
      newErrors.currentPassword = "Mật khẩu hiện tại là bắt buộc";
      isValid = false;
    }

    if (!passwordForm.newPassword.trim()) {
      newErrors.newPassword = "Mật khẩu mới là bắt buộc";
      isValid = false;
    } else if (passwordForm.newPassword.length < 8) {
      newErrors.newPassword = "Mật khẩu mới phải có ít nhất 8 ký tự";
      isValid = false;
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        passwordForm.newPassword
      )
    ) {
      newErrors.newPassword = "Mật khẩu mới phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt";
      isValid = false;
    }

    if (!passwordForm.confirmPassword.trim()) {
      newErrors.confirmPassword = "Xác nhận mật khẩu là bắt buộc";
      isValid = false;
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
      isValid = false;
    }

    setPasswordErrors(newErrors);
    return isValid;
  }, [passwordForm]);

  const handleChangePassword = useCallback(async () => {
    if (!validatePasswordForm()) {
      return;
    }
    try {
      await dispatch(changePassword(passwordForm)).unwrap();
      toast.success("Đổi mật khẩu thành công!");
      setIsPasswordModalOpen(false);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      toast.error(err.message || "Lỗi khi đổi mật khẩu");
    }
  }, [dispatch, passwordForm, validatePasswordForm]);

  const openPasswordModal = useCallback(() => {
    setIsPasswordModalOpen(true);
  }, []);

  const closePasswordModal = useCallback(() => {
    setIsPasswordModalOpen(false);
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setPasswordErrors({ currentPassword: "", newPassword: "", confirmPassword: "" });
  }, []);

  const openOrderOverlay = useCallback((order: Order) => {
    setSelectedOrder(order);
    setIsOrderOverlayOpen(true);
  }, []);

  const closeOrderOverlay = useCallback(() => {
    setIsOrderOverlayOpen(false);
    setSelectedOrder(null);
  }, []);

  return (
    <div className="py-8 bg-gray-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-[#269300]">Thông tin cá nhân</h1>

          {loading && (
            <div className="text-center py-8 text-gray-600">Đang tải...</div>
          )}
          {error && (
            <div className="text-center py-8 text-red-500 bg-red-50 rounded-md p-4">
              Lỗi: {error}
            </div>
          )}

          {user && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <div className="mr-4">
                    <Image
                      src="/images/user.png"
                      alt="User Avatar"
                      width={100}
                      height={100}
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{user.fullName || user.username}</h2>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Thông tin cá nhân</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                      <input
                        type="text"
                        name="fullName"
                        value={profileForm.fullName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#269300] focus:border-[#269300]"
                        placeholder="Nhập họ và tên"
                      />
                      {errors.fullName && (
                        <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={user.email}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={profileForm.phoneNumber}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#269300] focus:border-[#269300]"
                        placeholder="Nhập số điện thoại"
                      />
                      {errors.phoneNumber && (
                        <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                      <input
                        type="date"
                        name="birthdate"
                        value={profileForm.birthdate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#269300] focus:border-[#269300]"
                      />
                      {errors.birthdate && (
                        <p className="mt-1 text-sm text-red-600">{errors.birthdate}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                    <textarea
                      name="address"
                      value={profileForm.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#269300] focus:border-[#269300]"
                      rows={3}
                      placeholder="Nhập địa chỉ"
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                    )}
                  </div>

                  <div className="mt-6 flex space-x-4">
                    <button
                      onClick={handleUpdateProfile}
                      disabled={loading}
                      className="bg-[#269300] text-white px-4 py-2 rounded-md hover:bg-[#328615] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Đang xử lý..." : "Cập nhật thông tin"}
                    </button>
                    <button
                      onClick={handleLogout}
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="border-t mt-8 pt-6">
                  <h3 className="text-lg font-semibold mb-4">Tài khoản</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={openPasswordModal}
                      className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-[#269300] hover:bg-gray-50 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-[#269300]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                        />
                      </svg>
                      <span className="text-gray-700">Đổi mật khẩu</span>
                    </button>

                    <Link
                      href="/cart"
                      className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-[#269300] hover:bg-gray-50 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-[#269300]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <span className="text-gray-700">Giỏ hàng</span>
                    </Link>
                  </div>
                </div>

                {/* Order History */}
                <div className="border-t mt-8 pt-6">
                  <h3 className="text-lg font-semibold mb-4">Lịch sử mua hàng</h3>

                  {orders.length > 0 ? (
                    <div className="overflow-x-auto overflow-y max-h-[50vh]">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Mã đơn hàng
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Ngày mua
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Tổng tiền
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Trạng thái
                            </th>
                             <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Thanh toán
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Hành động
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {orders.map((order: Order) => (
                            <tr key={order.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                  onClick={() => router.push(`/orders/${order.id}`)}
                                  className="text-[#269300] hover:underline"
                                >
                                  #ORD-{order.id}
                                </button>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(order.orderDate)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatPrice(order.totalAmount)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    order.status === "DELIVERED" || order.status === "SHIPPED"
                                      ? "bg-green-100 text-green-800"
                                      : order.status === "PENDING" || order.status === "CONFIRMED"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {statusMap[order.status] || order.status}
                                </span>
                              </td>
                               <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    order.paymentStatus === "COMPLETED"
                                      ? "bg-green-100 text-green-800"
                                      : order.paymentStatus === "FAILED" 
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {statusMap[order.paymentStatus] || order.paymentStatus}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                  onClick={() => openOrderOverlay(order)}
                                  className="text-[#269300] hover:underline"
                                >
                                  Xem chi tiết
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500">Chưa có đơn hàng nào.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <Transition show={isPasswordModalOpen}>
            <Dialog className="relative z-50" onClose={closePasswordModal}>
              <Transition.Child
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
              </Transition.Child>

              <div className="fixed inset-0 flex items-center justify-center p-4">
                <Transition.Child
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md bg-white rounded-lg shadow-xl p-6">
                    <div className="flex justify-between items-center mb-4">
                      <Dialog.Title as="h3" className="text-lg font-medium text-gray-900">
                        Đổi mật khẩu
                      </Dialog.Title>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-500"
                        onClick={closePasswordModal}
                      >
                        <XMarkIcon className="h-6 w-6" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mật khẩu hiện tại
                        </label>
                        <input
                          type="password"
                          name="currentPassword"
                          value={passwordForm.currentPassword}
                          onChange={handlePasswordInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#269300] focus:border-[#269300]"
                          placeholder="Nhập mật khẩu hiện tại"
                        />
                        {passwordErrors.currentPassword && (
                          <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mật khẩu mới
                        </label>
                        <input
                          type="password"
                          name="newPassword"
                          value={passwordForm.newPassword}
                          onChange={handlePasswordInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#269300] focus:border-[#269300]"
                          placeholder="Nhập mật khẩu mới"
                        />
                        {passwordErrors.newPassword && (
                          <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Xác nhận mật khẩu
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={passwordForm.confirmPassword}
                          onChange={handlePasswordInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#269300] focus:border-[#269300]"
                          placeholder="Xác nhận mật khẩu mới"
                        />
                        {passwordErrors.confirmPassword && (
                          <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword}</p>
                        )}
                      </div>

                      <div className="flex justify-end space-x-4">
                        <button
                          type="button"
                          onClick={closePasswordModal}
                          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition duration-200"
                        >
                          Hủy
                        </button>
                        <button
                          type="button"
                          onClick={handleChangePassword}
                          disabled={loading}
                          className="px-4 py-2 text-white bg-[#269300] rounded-md hover:bg-[#328615] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
                        </button>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition>

          {/* Order Detail Overlay */}
          <Transition show={isOrderOverlayOpen}>
            <Dialog className="relative z-50" onClose={closeOrderOverlay}>
              <Transition.Child
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
              </Transition.Child>

              <div className="fixed inset-0 flex items-center justify-center p-4">
                <Transition.Child
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-2xl bg-white rounded-lg shadow-xl p-6 max-h-[80vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                      <Dialog.Title as="h3" className="text-lg font-medium text-gray-900">
                        Chi tiết đơn hàng #{selectedOrder?.id}
                      </Dialog.Title>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-500"
                        onClick={closeOrderOverlay}
                      >
                        <XMarkIcon className="h-6 w-6" />
                      </button>
                    </div>

                    {selectedOrder && (
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-md font-semibold text-gray-700 mb-2">Thông tin đơn hàng</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Ngày đặt hàng:</span>{" "}
                                {formatDate(selectedOrder.orderDate)}
                              </p>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Tổng tiền:</span>{" "}
                                {formatPrice(selectedOrder.totalAmount)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Trạng thái:</span>{" "}
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    selectedOrder.status === "DELIVERED" || selectedOrder.status === "SHIPPED"
                                      ? "bg-green-100 text-green-800"
                                      : selectedOrder.status === "PENDING" || selectedOrder.status === "CONFIRMED"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {statusMap[selectedOrder.status] || selectedOrder.status}
                                </span>
                              </p>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Phương thức thanh toán:</span>{" "}
                                {selectedOrder.paymentMethod}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Shipping Information */}
                        <div>
                          <h4 className="text-md font-semibold text-gray-700 mb-2">Thông tin giao hàng</h4>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Người nhận:</span> {selectedOrder.recipientName}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Số điện thoại:</span> {selectedOrder.phoneNumber}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Địa chỉ:</span> {selectedOrder.shippingAddress}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-md font-semibold text-gray-700 mb-2">Sản phẩm</h4>
                          {selectedOrder.items && selectedOrder.items.length > 0 ? (
                            <div className="space-y-4">
                              {selectedOrder.items.map((item : any, index : number) => (
                                <div
                                  key={index}
                                  className="flex items-center border-t pt-4 first:border-t-0 first:pt-0"
                                >
                                  {item.fruit?.image && (
                                    <Image
                                      src={item.fruit.image}
                                      alt={item.fruit.name}
                                      width={60}
                                      height={60}
                                      className="rounded-md mr-4"
                                    />
                                  )}
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">
                                      {item.fruit?.name || "Sản phẩm không xác định"}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      Số lượng: {item.quantity}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      Giá: {formatPrice(item.price)}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm font-medium text-gray-900">
                                      {formatPrice(item.quantity * item.price)}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">Không có sản phẩm trong đơn hàng.</p>
                          )}
                        </div>

                        {/* Total */}
                        <div className="border-t pt-4">
                          <div className="flex justify-between text-md font-semibold">
                            <span>Tổng cộng:</span>
                            <span>{formatPrice(selectedOrder.totalAmount)}</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-4">
                          <button
                            onClick={() => router.push(`/orders/${selectedOrder.id}`)}
                            className="px-4 py-2 text-[#269300] border border-[#269300] rounded-md hover:bg-[#269300] hover:text-white transition duration-200"
                          >
                            Xem chi tiết đầy đủ
                          </button>
                          <button
                            onClick={closeOrderOverlay}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition duration-200"
                          >
                            Đóng
                          </button>
                        </div>
                      </div>
                    )}
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;