'use client';

import { useState, useEffect } from 'react';
import api, { setAuthToken } from '@/services/api';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import Link from 'next/link';

interface DecodedToken {
  user: {
    id: string;
    role: string;
  }
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  date: string;
}

interface Listing {
  _id: string;
  title: string;
  game: string;
  price: number;
  status: string;
  seller: {
    name: string;
  };
}

interface Transaction {
  _id: string;
  listing: {
    title: string;
    price: number;
  };
  status: string;
  buyer: {
    name: string;
  };
  seller: {
    name: string;
  };
}

const AdminDashboardPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [adminInfo, setAdminInfo] = useState<any>(null);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    delete api.defaults.headers.common['x-admin-token'];
    router.push('/admin/login');
  };

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    const adminData = localStorage.getItem('adminData');
    
    if (adminToken && adminData) {
      // Set admin token for API requests
      api.defaults.headers.common['x-admin-token'] = adminToken;
      
      // Set admin info
      setAdminInfo(JSON.parse(adminData));
      
      // Fetch admin data
      const fetchData = async () => {
        try {
          // Verify admin token first
          await api.get('/admin/auth/me');
          
          const [usersRes, listingsRes] = await Promise.all([
            api.get('/admin/users'),
            api.get('/listings')
          ]);
          setUsers(usersRes.data);
          setListings(listingsRes.data);
        } catch (err) {
          console.error('Failed to fetch admin data', err);
          alert('Session hết hạn hoặc không có quyền admin.');
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminData');
          router.push('/admin/login');
          return;
        }
        setIsLoading(false);
      };

      fetchData();
    } else {
      router.push('/admin/login');
    }
  }, [router]);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-red-100 text-red-800';
      case 'Seller': return 'bg-green-100 text-green-800';
      case 'Buyer': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800';
      case 'Sold': return 'bg-gray-100 text-gray-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-2xl">🔄 Đang tải Admin Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              👑 ADMIN DASHBOARD
            </h1>
            <p className="text-xl text-gray-300">
              Quản lý toàn bộ hệ thống ShopT1
            </p>
          </div>
          
          {adminInfo && (
            <div className="bg-black bg-opacity-30 rounded-2xl p-4 backdrop-blur-lg border border-white border-opacity-20">
              <div className="text-white text-right">
                <div className="flex items-center space-x-3">
                  <div>
                    <p className="font-bold">{adminInfo.fullName}</p>
                    <p className="text-sm text-gray-300">@{adminInfo.username}</p>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      adminInfo.role === 'SuperAdmin' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-black'
                    }`}>
                      {adminInfo.role}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    🚪 Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Link href="/listings/new" className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl p-6 text-white text-center hover:shadow-2xl transition-all transform hover:-translate-y-2">
            <div className="text-3xl mb-2">➕</div>
            <div className="font-bold">ĐĂNG BÁN NICK</div>
            <div className="text-sm opacity-90">Thêm nick mới</div>
          </Link>
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white text-center">
            <div className="text-3xl mb-2">👥</div>
            <div className="font-bold">{users.length}</div>
            <div className="text-sm opacity-90">Tổng người dùng</div>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 text-white text-center">
            <div className="text-3xl mb-2">🎮</div>
            <div className="font-bold">{listings.length}</div>
            <div className="text-sm opacity-90">Tổng nick game</div>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white text-center">
            <div className="text-3xl mb-2">💰</div>
            <div className="font-bold">{listings.reduce((sum, l) => sum + l.price, 0).toLocaleString('vi-VN')}đ</div>
            <div className="text-sm opacity-90">Tổng giá trị</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-1">
            <div className="flex space-x-1">
              {[
                { id: 'overview', label: '📊 Tổng quan', icon: '📊' },
                { id: 'users', label: '👥 Người dùng', icon: '👥' },
                { id: 'listings', label: '🎮 Nick Game', icon: '🎮' },
                { id: 'transactions', label: '💳 Giao dịch', icon: '💳' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3 px-4 text-center font-bold rounded-xl transition-all ${activeTab === tab.id
                      ? 'bg-white text-gray-800 shadow-lg'
                      : 'text-white hover:bg-white hover:bg-opacity-10'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">📈 Thống kê tổng quan</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-600 text-sm font-medium">Tổng người dùng</p>
                        <p className="text-3xl font-bold text-blue-700">{users.length}</p>
                      </div>
                      <div className="text-3xl">👥</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-600 text-sm font-medium">Nick đang bán</p>
                        <p className="text-3xl font-bold text-green-700">{listings.filter(l => l.status === 'Available').length}</p>
                      </div>
                      <div className="text-3xl">🎮</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border-l-4 border-purple-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-600 text-sm font-medium">Nick đã bán</p>
                        <p className="text-3xl font-bold text-purple-700">{listings.filter(l => l.status === 'Sold').length}</p>
                      </div>
                      <div className="text-3xl">✅</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border-l-4 border-orange-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-600 text-sm font-medium">Doanh thu ước tính</p>
                        <p className="text-2xl font-bold text-orange-700">{(listings.filter(l => l.status === 'Sold').reduce((sum, l) => sum + l.price, 0) * 0.05).toLocaleString('vi-VN')}đ</p>
                      </div>
                      <div className="text-3xl">💰</div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">🔥 Hoạt động gần đây</h3>
                  <div className="space-y-3">
                    {listings.slice(0, 5).map((listing) => (
                      <div key={listing._id} className="flex items-center justify-between bg-white p-4 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">🎮</div>
                          <div>
                            <p className="font-medium">{listing.title}</p>
                            <p className="text-sm text-gray-600">Bởi {listing.seller.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">{listing.price.toLocaleString('vi-VN')}đ</p>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(listing.status)}`}>
                            {listing.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-800">👥 Quản lý người dùng ({users.length})</h2>
                  <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-bold hover:shadow-lg transition-all">
                    ➕ Thêm Admin
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người dùng</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tham gia</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="text-2xl mr-3">
                                {user.role === 'Admin' ? '👑' : user.role === 'Seller' ? '🛒' : '👤'}
                              </div>
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(user.role)}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.date).toLocaleDateString('vi-VN')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-indigo-600 hover:text-indigo-900 mr-3">Sửa</button>
                            <button className="text-red-600 hover:text-red-900">Xóa</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Listings Tab */}
            {activeTab === 'listings' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-800">🎮 Quản lý Nick Game ({listings.length})</h2>
                  <Link href="/listings/new" className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:shadow-lg transition-all">
                    ➕ Đăng bán nick mới
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {listings.map((listing) => (
                    <div key={listing._id} className="bg-white border rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                      <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                        <div className="absolute top-3 right-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(listing.status)}`}>
                            {listing.status}
                          </span>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-4xl opacity-70">🎮</span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-2 line-clamp-2">{listing.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">Game: {listing.game}</p>
                        <p className="text-sm text-gray-600 mb-3">Seller: {listing.seller.name}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-bold text-green-600">
                            {listing.price.toLocaleString('vi-VN')}đ
                          </span>
                          <div className="space-x-2">
                            <button className="text-blue-600 hover:text-blue-800 text-sm">Sửa</button>
                            <button className="text-red-600 hover:text-red-800 text-sm">Xóa</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">💳 Quản lý giao dịch</h2>
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🚧</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Tính năng đang phát triển</h3>
                  <p className="text-gray-600">Chức năng quản lý giao dịch sẽ được cập nhật sớm!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
