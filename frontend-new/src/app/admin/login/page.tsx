'use client';

import { useState } from 'react';
import api from '@/services/api';
import { useRouter } from 'next/navigation';

const AdminLoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { email, password } = formData;
  const router = useRouter();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await api.post("/admin/auth", { email, password });
      
      // Store admin token
      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("adminData", JSON.stringify(res.data.admin));
      
      // Set default header for future requests
      api.defaults.headers.common['x-admin-token'] = res.data.token;
      
      router.push("/admin/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.errors?.[0]?.msg || "Đăng nhập thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-black bg-opacity-80 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-red-500 border-opacity-30">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 p-8 text-center relative">
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            <div className="relative z-10">
              <div className="text-5xl mb-4">👑</div>
              <h1 className="text-3xl font-bold text-white mb-2">ADMIN LOGIN</h1>
              <p className="text-red-100">ShopT1 Administrator Panel</p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-900 bg-opacity-50 border border-red-500 rounded-lg">
                <p className="text-red-300 text-sm flex items-center">
                  <span className="mr-2">⚠️</span>
                  {error}
                </p>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  📧 Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Nhập email admin"
                  value={email}
                  onChange={onChange}
                  className="w-full px-4 py-4 bg-gray-900 bg-opacity-50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  🔐 Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Nhập mật khẩu admin"
                  value={password}
                  onChange={onChange}
                  className="w-full px-4 py-4 bg-gray-900 bg-opacity-50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-8 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Đang đăng nhập...
                </span>
              ) : (
                "🚀 TRUY CẬP ADMIN PANEL"
              )}
            </button>

            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                Chỉ dành cho quản trị viên ShopT1
              </p>
              <a href="/" className="text-red-400 hover:text-red-300 text-sm transition-colors">
                ← Về trang chủ
              </a>
            </div>
          </form>
        </div>

        {/* Security Notice */}
        <div className="mt-6 bg-black bg-opacity-60 backdrop-blur-lg rounded-2xl p-6 border border-yellow-500 border-opacity-30">
          <div className="flex items-start space-x-3">
            <div className="text-2xl">🔒</div>
            <div>
              <h3 className="text-yellow-400 font-bold text-sm mb-2">BẢO MẬT CAO</h3>
              <ul className="text-gray-300 text-xs space-y-1">
                <li>• Phiên đăng nhập tự động hết hạn sau 8 giờ</li>
                <li>• Tất cả hoạt động được ghi log</li>
                <li>• Chỉ admin có quyền truy cập</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;




