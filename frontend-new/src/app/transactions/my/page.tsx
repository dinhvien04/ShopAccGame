'use client';

import { useState, useEffect } from 'react';
import api, { setAuthToken } from '@/services/api';
import { useRouter } from 'next/navigation';

interface Transaction {
  _id: string;
  listing: {
    title: string;
    price: number;
  };
  status: string;
  buyer?: { name: string };
  seller?: { name: string };
}

const MyTransactionsPage = () => {
  const [purchases, setPurchases] = useState<Transaction[]>([]);
  const [sales, setSales] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchTransactions = async () => {
    try {
      const [purchasesRes, salesRes] = await Promise.all([
        api.get('/transactions/my-purchases'),
        api.get('/transactions/my-sales'),
      ]);
      setPurchases(purchasesRes.data);
      setSales(salesRes.data);
    } catch (err) {
      console.error('Failed to fetch transactions', err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      fetchTransactions();
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/transactions/${id}/status`, { status });
      // Refresh the data
      fetchTransactions();
      alert(`Transaction updated to ${status}`);
    } catch (err: any) {
      alert(`Error: ${err.response?.data?.msg || 'Could not update status.'}`);
    }
  };

  if (isLoading) {
    return <div>Loading transactions...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            📊 GIAO DỊCH CỦA TÔI
          </h1>
          <p className="text-xl text-gray-300">
            Quản lý tất cả giao dịch mua bán nick game
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl p-6 text-white text-center">
            <div className="text-3xl mb-2">💰</div>
            <div className="text-2xl font-bold">{purchases.length}</div>
            <div className="text-sm opacity-90">Nick đã mua</div>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white text-center">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-2xl font-bold">{sales.length}</div>
            <div className="text-sm opacity-90">Nick đã bán</div>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 text-white text-center">
            <div className="text-3xl mb-2">⭐</div>
            <div className="text-2xl font-bold">5.0</div>
            <div className="text-sm opacity-90">Đánh giá</div>
          </div>
        </div>

        {/* My Purchases */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 mb-6 shadow-xl">
            <h2 className="text-2xl font-bold text-white flex items-center">
              🛒 NICK ĐÃ MUA ({purchases.length})
            </h2>
            <p className="text-blue-100 mt-2">Các nick game bạn đã mua từ ShopT1</p>
          </div>

          <div className="space-y-4">
            {purchases.length > 0 ? (
              purchases.map((p) => (
                <div key={p._id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-800 mb-2">{p.listing.title}</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">💰 Giá:</span> {p.listing.price.toLocaleString('vi-VN')}đ
                          </div>
                          <div>
                            <span className="font-medium">👤 Người bán:</span> {p.seller?.name}
                          </div>
                          <div>
                            <span className="font-medium">📅 Trạng thái:</span>
                            <span className={`ml-2 px-3 py-1 rounded-full text-xs font-bold ${p.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                p.status === 'Delivered' ? 'bg-blue-100 text-blue-800' :
                                  p.status === 'Paid' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-800'
                              }`}>
                              {p.status === 'Initiated' && '🔄 Đã khởi tạo'}
                              {p.status === 'Paid' && '💳 Đã thanh toán'}
                              {p.status === 'Delivered' && '📦 Đã giao'}
                              {p.status === 'Confirmed' && '✅ Đã xác nhận'}
                              {p.status === 'Completed' && '🎉 Hoàn thành'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 md:mt-0 md:ml-6">
                        {p.status === 'Initiated' && (
                          <button
                            onClick={() => handleUpdateStatus(p._id, 'Paid')}
                            className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:shadow-lg transition-all"
                          >
                            💳 Xác nhận đã trả tiền
                          </button>
                        )}
                        {p.status === 'Delivered' && (
                          <button
                            onClick={() => handleUpdateStatus(p._id, 'Confirmed')}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-bold hover:shadow-lg transition-all"
                          >
                            ✅ Xác nhận đã nhận nick
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 bg-white rounded-xl">
                <div className="text-6xl mb-4">🛒</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Chưa mua nick nào</h3>
                <p className="text-gray-600 mb-6">Khám phá kho nick game siêu hot của chúng tôi!</p>
                <a href="/listings" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all">
                  🎮 XEM NICK GAME
                </a>
              </div>
            )}
          </div>
        </div>

        {/* My Sales */}
        <div>
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-6 mb-6 shadow-xl">
            <h2 className="text-2xl font-bold text-white flex items-center">
              💼 NICK ĐANG BÁN ({sales.length})
            </h2>
            <p className="text-green-100 mt-2">Các nick game bạn đã đăng bán</p>
          </div>

          <div className="space-y-4">
            {sales.length > 0 ? (
              sales.map((s) => (
                <div key={s._id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-800 mb-2">{s.listing.title}</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">💰 Giá:</span> {s.listing.price.toLocaleString('vi-VN')}đ
                          </div>
                          <div>
                            <span className="font-medium">👤 Người mua:</span> {s.buyer?.name}
                          </div>
                          <div>
                            <span className="font-medium">📅 Trạng thái:</span>
                            <span className={`ml-2 px-3 py-1 rounded-full text-xs font-bold ${s.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                s.status === 'Delivered' ? 'bg-blue-100 text-blue-800' :
                                  s.status === 'Paid' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-800'
                              }`}>
                              {s.status === 'Initiated' && '🔄 Chờ thanh toán'}
                              {s.status === 'Paid' && '💳 Đã thanh toán'}
                              {s.status === 'Delivered' && '📦 Đã giao nick'}
                              {s.status === 'Confirmed' && '✅ Đã xác nhận'}
                              {s.status === 'Completed' && '🎉 Hoàn thành'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 md:mt-0 md:ml-6">
                        {s.status === 'Paid' && (
                          <button
                            onClick={() => handleUpdateStatus(s._id, 'Delivered')}
                            className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-6 py-2 rounded-lg font-bold hover:shadow-lg transition-all"
                          >
                            📦 Xác nhận đã giao nick
                          </button>
                        )}
                        {s.status === 'Confirmed' && (
                          <button
                            onClick={() => handleUpdateStatus(s._id, 'Completed')}
                            className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-2 rounded-lg font-bold hover:shadow-lg transition-all"
                          >
                            🎉 Hoàn tất giao dịch
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 bg-white rounded-xl">
                <div className="text-6xl mb-4">💼</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Chưa có nick nào đang bán</h3>
                <p className="text-gray-600 mb-6">Bắt đầu kiếm tiền từ nick game của bạn!</p>
                <a href="/listings/new" className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all">
                  ➕ ĐĂNG BÁN NICK
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTransactionsPage;
