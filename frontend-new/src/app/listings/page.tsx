'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';

interface Listing {
  _id: string;
  title: string;
  game: string;
  price: number;
}

const ListingsPage = () => {
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await api.get('/listings');
        setListings(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchListings();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            🎮 TẤT CẢ NICK GAME
          </h1>
          <p className="text-xl text-gray-300">
            Khám phá kho nick game khổng lồ với giá siêu rẻ!
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-xl">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="🔍 Tìm kiếm nick game..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <select className="px-6 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              <option>🎯 Tất cả game</option>
              <option>🎮 Liên Quân Mobile</option>
              <option>🔥 Free Fire</option>
              <option>🍎 Blox Fruits</option>
              <option>⚔️ Valorant</option>
            </select>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg transition-all">
              TÌM KIẾM
            </button>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <div key={listing._id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden group">
              {/* Image Placeholder */}
              <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-20 group-hover:opacity-10 transition-opacity"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl opacity-50">🎮</span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    ✅ CÒN HÀNG
                  </span>
                </div>
                <div className="absolute bottom-3 left-3">
                  <span className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                    {listing.game}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-2">
                  {listing.title}
                </h3>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600">
                    🎯 Game: {listing.game}
                  </span>
                  <span className="text-sm text-green-600 font-bold">
                    ⭐ RANK CAO
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-red-600">
                      {listing.price.toLocaleString('vi-VN')}đ
                    </span>
                    <div className="text-xs text-gray-500 line-through">
                      {(listing.price * 1.5).toLocaleString('vi-VN')}đ
                    </div>
                  </div>
                  <button className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:shadow-lg transition-all">
                    MUA NGAY
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        {listings.length > 0 && (
          <div className="text-center mt-12">
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg transition-all">
              📄 XEM THÊM NICK
            </button>
          </div>
        )}

        {/* Empty State */}
        {listings.length === 0 && (
          <div className="text-center py-16">
            <div className="text-8xl mb-4">😔</div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Không tìm thấy nick nào
            </h3>
            <p className="text-gray-300">
              Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingsPage;
