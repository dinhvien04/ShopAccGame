'use client';

import { useState } from 'react';
import api from '@/services/api';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setAuthToken } from "@/services/api";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState('');

  const { email, password } = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth", { email, password });
      localStorage.setItem("token", res.data.token);
      setAuthToken(res.data.token);
      window.location.href = "/"; // Redirect to homepage
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.errors) {
        setError(err.response.data.errors.map((error: any) => error.msg).join(', '));
      } else if (err.response && err.response.data && err.response.data.msg) {
        setError(err.response.data.msg);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      console.error(err); // Handle error
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center">
            <div className="text-4xl mb-2">🎮</div>
            <h1 className="text-2xl font-bold text-white">ĐĂNG NHẬP</h1>
            <p className="text-blue-100">Vào ShopT1 để mua nick game</p>
          </div>

          {error && <p className="text-red-500 text-center p-4">{error}</p>}
          <form onSubmit={onSubmit} className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📧 Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Nhập email của bạn"
                  value={email}
                  onChange={onChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🔒 Mật khẩu
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={onChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              🚀 ĐĂNG NHẬP NGAY
            </button>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Chưa có tài khoản?
                <a href="/register" className="text-blue-600 font-bold hover:text-blue-800 ml-1">
                  Đăng ký ngay!
                </a>
              </p>
            </div>
          </form>
        </div>

        {/* Features */}
        <div className="mt-6 grid grid-cols-3 gap-4 text-center text-white">
          <div>
            <div className="text-2xl mb-1">🛡️</div>
            <p className="text-xs">Bảo mật</p>
          </div>
          <div>
            <div className="text-2xl mb-1">⚡</div>
            <p className="text-xs">Nhanh chóng</p>
          </div>
          <div>
            <div className="text-2xl mb-1">💎</div>
            <p className="text-xs">Uy tín</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
