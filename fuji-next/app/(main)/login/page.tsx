'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Lock, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { BaseURL } from '@/app/utils/baseUrl';
import { login, register } from '@/app/store/slices/authSlice';
import { RootState, useAppDispatch } from '@/app/store';
import { toast } from 'react-toastify';

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, error: authError } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const validatePassword = (pwd: string): string | null => {
    console.log(pwd.length);
    
    if (pwd.length < 8) {
      return 'Mật khẩu phải dài hơn 8 ký tự';
    }
    if (!/[A-Z]/.test(pwd)) {
      return 'Mật khẩu phải chứa ít nhất một chữ in hoa';
    }
    if (!/[0-9]/.test(pwd)) {
      return 'Mật khẩu phải chứa ít nhất một số';
    }
    return null;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // const passwordError = validatePassword(password);
    // if (passwordError) {
    //   setError(passwordError);
    //   setIsLoading(false);
    //   return;
    // }

    try {
      const success = await dispatch(login({ username: userName, password })).unwrap();
      if (success) {
        const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
        const res = await axios.get(`${BaseURL.auth}/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const role = res.data.data.roles[0];

        if (role === 'ROLE_ADMIN') {
          router.push('/admin');
        } else if (role === 'ROLE_USER') {
          router.push('/');
        } else {
          throw new Error('Vai trò không hợp lệ');
        }
      } else {
        throw new Error('Đăng nhập thất bại');
      }
    } catch (err: any) {
      setError(err.message || authError || 'Tài khoản hoặc mật khẩu không hợp lệ');
    } finally {
      setIsLoading(false);
    }
  };


const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);

  const passwordError = validatePassword(password);
  if (passwordError) {
    setError(passwordError);
    setIsLoading(false);
    return;
  }

  if (password !== confirmPassword) {
    setError('Mật khẩu xác nhận không khớp');
    setIsLoading(false);
    return;
  }

  try {
    await dispatch(register({ username: userName, email, password })).unwrap();
    setMode('login');
    setUserName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
  } catch (err: any) {
    setError(err.message || 'Đăng ký thất bại');
  } finally {
    setIsLoading(false);
  }
};

  const handleSubmit = mode === 'login' ? handleLogin : handleRegister;

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-green-50 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-8 bg-white shadow-lg rounded-xl"
      >
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-[#269300] tracking-wide">
            {mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {mode === 'login' ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}{' '}
            <button
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="font-medium text-[#269300] hover:text-[#328615] transition-colors"
            >
              {mode === 'login' ? 'Đăng ký ngay' : 'Đăng nhập ngay'}
            </button>
          </p>
        </div>

        <motion.form
          key={mode}
          initial={{ opacity: 0, x: mode === 'login' ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
          onSubmit={handleSubmit}
        >
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 text-red-700 border-l-4 border-red-500 rounded-md bg-red-50"
            >
              <span>{error}</span>
            </motion.div>
          )}

          <div className="relative">
            <label htmlFor="userName" className="block mb-1 text-sm font-medium text-gray-700">
              Tên đăng nhập
            </label>
            <div className="relative">
              <User className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <input
                id="userName"
                name="userName"
                autoComplete="username"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#269300] focus:border-[#269300] sm:text-sm transition-colors"
                placeholder="Nhập tên đăng nhập"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div className="relative">
              <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#269300] focus:border-[#269300] sm:text-sm transition-colors"
                  placeholder="Nhập email"
                />
              </div>
            </div>
          )}

          <div className="relative">
            <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#269300] focus:border-[#269300] sm:text-sm transition-colors"
                placeholder="Nhập mật khẩu"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div className="relative">
              <label htmlFor="confirmPassword" className="block mb-1 text-sm font-medium text-gray-700">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#269300] focus:border-[#269300] sm:text-sm transition-colors"
                  placeholder="Xác nhận mật khẩu"
                />
              </div>
            </div>
          )}

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#269300] hover:bg-[#328615] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#269300] disabled:opacity-50 transition-colors"
          >
            {isLoading ? (
              <>
                <svg className="w-5 h-5 mr-2 text-white animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Đang xử lý...
              </>
            ) : mode === 'login' ? (
              'Đăng nhập'
            ) : (
              'Đăng ký'
            )}
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
}