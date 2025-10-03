
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  user: {
    id: string;
    role: string;
  }
}

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      const decoded = jwtDecode<DecodedToken>(token);
      setUserRole(decoded.user.role);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    window.location.href = '/'; // Reload to clear state
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 shadow-2xl sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="text-3xl">🎮</div>
            <div>
              <div className="text-white text-xl font-bold group-hover:text-yellow-400 transition-colors">
                SHOP<span className="text-yellow-400">T1</span>
              </div>
              <div className="text-xs text-gray-300">NICK GAME UY TÍN</div>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-white hover:text-yellow-400 transition-colors font-medium">
              🏠 Trang chủ
            </Link>
            <Link href="/listings" className="text-white hover:text-yellow-400 transition-colors font-medium">
              🎯 Mua Nick
            </Link>
            <Link href="/admin/login" className="text-yellow-400 hover:text-yellow-300 transition-colors font-medium">
              👑 Admin
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/listings/new"
                  className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:shadow-lg transition-all"
                >
                  ➕ Đăng bán
                </Link>
                <Link
                  href="/transactions/my"
                  className="text-white hover:text-yellow-400 transition-colors font-medium"
                >
                  📊 Giao dịch
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-600 transition-colors"
                >
                  🚪 Đăng xuất
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-white hover:text-yellow-400 transition-colors font-medium"
                >
                  🔑 Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-2 rounded-lg font-bold hover:shadow-lg transition-all"
                >
                  ⭐ Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden pb-4">
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/" className="text-white hover:text-yellow-400 text-sm">Trang chủ</Link>
            <Link href="/listings" className="text-white hover:text-yellow-400 text-sm">Mua Nick</Link>
            {isAuthenticated && (
              <>
                <Link href="/listings/new" className="text-white hover:text-yellow-400 text-sm">Đăng bán</Link>
                <Link href="/transactions/my" className="text-white hover:text-yellow-400 text-sm">Giao dịch</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
