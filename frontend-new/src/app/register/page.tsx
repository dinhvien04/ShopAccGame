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

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { name, email, password, confirmPassword } = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      console.log("Passwords do not match"); // Replace with user-friendly alert
    } else {
      try {
        const res = await api.post("/users", { name, email, password });
        localStorage.setItem("token", res.data.token);
        setAuthToken(res.data.token);
        window.location.href = "/"; // Redirect to homepage
      } catch (err) {
        console.error(err); // Handle error (e.g., show error message)
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 text-center">
            <div className="text-4xl mb-2">⭐</div>
            <h1 className="text-2xl font-bold text-white">ĐĂNG KÝ</h1>
            <p className="text-green-100">Tạo tài khoản ShopT1 miễn phí</p>
          </div>

          <form onSubmit={onSubmit} className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  👤 Họ và tên
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Nhập họ và tên của bạn"
                  value={name}
                  onChange={onChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

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
                  placeholder="Tối thiểu 6 ký tự"
                  value={password}
                  onChange={onChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  required
                  minLength={6}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🔐 Xác nhận mật khẩu
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Nhập lại mật khẩu"
                  value={confirmPassword}
                  onChange={onChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-6 bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              🎉 TẠO TÀI KHOẢN NGAY
            </button>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Đã có tài khoản?
                <a href="/login" className="text-blue-600 font-bold hover:text-blue-800 ml-1">
                  Đăng nhập ngay!
                </a>
              </p>
            </div>

            <div className="mt-4 text-xs text-gray-500 text-center">
              Bằng việc đăng ký, bạn đồng ý với điều khoản sử dụng của ShopT1
            </div>
          </form>
        </div>

        {/* Benefits */}
        <div className="mt-6 grid grid-cols-2 gap-4 text-center text-white text-sm">
          <div className="bg-white bg-opacity-10 rounded-lg p-3">
            <div className="text-xl mb-1">💰</div>
            <p>Giá rẻ nhất</p>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-3">
            <div className="text-xl mb-1">🎮</div>
            <p>Nhiều game</p>
          </div>
        </div>
      </div>
    </div>
  );
};


export default RegisterPage;
