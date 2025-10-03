'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import Link from 'next/link';

interface Listing {
  _id: string;
  title: string;
  price: number;
  game: string;
  status: string;
}

const HomePage = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await api.get("/listings", { params: { search: searchTerm } });
        setListings(res.data);
      } catch (err) {
        console.error("Error fetching listings:", err);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchListings();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Group listings by game
  const gameCategories = [
    {
      name: "LIÊN QUÂN MOBILE",
      icon: "🎮",
      color: "from-blue-600 to-purple-600",
      games: ["Liên Quân", "AOV", "Arena of Valor"]
    },
    {
      name: "FREE FIRE",
      icon: "🔥",
      color: "from-orange-500 to-red-600",
      games: ["Free Fire", "FF"]
    },
    {
      name: "BLOX FRUITS",
      icon: "🍎",
      color: "from-green-500 to-blue-500",
      games: ["Blox Fruits", "Roblox"]
    },
    {
      name: "ĐTCL + VALORANT",
      icon: "⚔️",
      color: "from-purple-600 to-pink-600",
      games: ["DTCL", "TFT", "Valorant", "Đấu Trường Chân Lý"]
    }
  ];

  const getListingsByCategory = (categoryGames: string[]) => {
    return listings.filter(listing =>
      categoryGames.some(game =>
        listing.game.toLowerCase().includes(game.toLowerCase())
      )
    ).slice(0, 5);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 py-16">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              SHOP NICK GAME
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              🎮 UY TÍN - GIÁ RẺ - CHẤT LƯỢNG 🎮
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <span className="bg-red-500 text-white px-4 py-2 rounded-full font-bold">🔥 HOT SALE</span>
              <span className="bg-green-500 text-white px-4 py-2 rounded-full font-bold">✅ UY TÍN</span>
              <span className="bg-yellow-500 text-white px-4 py-2 rounded-full font-bold">⚡ NHANH CHÓNG</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="container mx-auto px-4 -mt-8 relative z-20">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-2">
            <input
              type="text"
              placeholder="🔍 Tìm kiếm nick game..."
              className="w-full px-6 py-4 text-lg rounded-xl border-0 focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Game Categories */}
      <div className="container mx-auto px-4 py-12">
        {gameCategories.map((category, index) => {
          const categoryListings = getListingsByCategory(category.games);

          return (
            <div key={index} className="mb-16">
              {/* Category Header */}
              <div className={`bg-gradient-to-r ${category.color} rounded-2xl p-6 mb-8 shadow-xl`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{category.icon}</span>
                    <h2 className="text-2xl md:text-3xl font-bold text-white">
                      KHO NICK {category.name}
                    </h2>
                  </div>
                  <Link
                    href="/listings"
                    className="bg-white text-gray-800 px-6 py-2 rounded-full font-bold hover:bg-gray-100 transition-colors"
                  >
                    Xem tất cả →
                  </Link>
                </div>
              </div>

              {/* Listings Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {categoryListings.length > 0 ? (
                  categoryListings.map((listing) => (
                    <Link key={listing._id} href={`/listings/${listing._id}`}>
                      <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden group">
                        {/* Placeholder Image */}
                        <div className={`h-40 bg-gradient-to-br ${category.color} relative overflow-hidden`}>
                          <div className="absolute inset-0 bg-black opacity-20 group-hover:opacity-10 transition-opacity"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-6xl opacity-50">{category.icon}</span>
                          </div>
                          <div className="absolute top-2 right-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${listing.status === 'Available' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                              }`}>
                              {listing.status === 'Available' ? '✅ CÒN HÀNG' : '❌ HẾT HÀNG'}
                            </span>
                          </div>
                        </div>

                        <div className="p-4">
                          <h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-2">
                            {listing.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3">Game: {listing.game}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-red-600">
                              {listing.price.toLocaleString('vi-VN')}đ
                            </span>
                            <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-bold hover:shadow-lg transition-all">
                              MUA NGAY
                            </button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <div className="text-6xl mb-4">😔</div>
                    <p className="text-white text-xl">Chưa có nick {category.name} nào</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center text-white">
              <div className="text-5xl mb-4">🛡️</div>
              <h3 className="text-xl font-bold mb-2">UY TÍN HÀNG ĐẦU</h3>
              <p className="opacity-80">Cam kết bảo mật thông tin khách hàng 100%</p>
            </div>
            <div className="text-center text-white">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-2">GIAO DỊCH NHANH</h3>
              <p className="opacity-80">Xử lý đơn hàng trong vòng 1-5 phút</p>
            </div>
            <div className="text-center text-white">
              <div className="text-5xl mb-4">💎</div>
              <h3 className="text-xl font-bold mb-2">GIÁ CẢ TỐT NHẤT</h3>
              <p className="opacity-80">Giá rẻ nhất thị trường, nhiều ưu đãi</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;