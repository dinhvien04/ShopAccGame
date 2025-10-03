'use client';

import { useState, useEffect } from 'react';
import api, { setAuthToken } from '@/services/api';
import { useRouter } from 'next/navigation';

const NewListingPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    game: '',
  });
  const [images, setImages] = useState<File[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      setAuthToken(token);
    } else {
      // If not authenticated, redirect to login page
      router.push('/login');
    }
  }, [router]);

  const { title, description, price, game } = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const postData = new FormData();
    postData.append('title', title);
    postData.append('description', description);
    postData.append('price', price);
    postData.append('game', game);
    images.forEach(image => {
      postData.append('images', image);
    });

    try {
      const res = await api.post('/listings', postData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Listing created successfully!');
      router.push(`/listings/${res.data._id}`); // Redirect to the new listing's page
    } catch (err: any) {
      console.error(err);
      alert(`Error: ${err.response?.data?.errors[0]?.msg || 'Could not create listing.'}`);
    }
  };

  if (!isAuthenticated) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            ➕ ĐĂNG BÁN NICK GAME
          </h1>
          <p className="text-xl text-gray-300">
            Bán nick game của bạn với giá tốt nhất!
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 text-center">
            <div className="text-3xl mb-2">🎯</div>
            <h2 className="text-xl font-bold text-white">THÔNG TIN NICK GAME</h2>
            <p className="text-green-100">Điền đầy đủ thông tin để bán nhanh hơn</p>
          </div>

          <form onSubmit={onSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🎮 Tiêu đề nick
              </label>
              <input
                type="text"
                name="title"
                value={title}
                onChange={onChange}
                placeholder="VD: Nick Liên Quân Tướng Đầy Đủ Rank Thách Đấu"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Tiêu đề hấp dẫn sẽ bán được nhanh hơn</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🎯 Loại game
              </label>
              <select
                name="game"
                value={game}
                onChange={onChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                required
              >
                <option value="">Chọn loại game</option>
                <option value="Liên Quân Mobile">🎮 Liên Quân Mobile</option>
                <option value="Free Fire">🔥 Free Fire</option>
                <option value="Blox Fruits">🍎 Blox Fruits</option>
                <option value="DTCL">⚔️ Đấu Trường Chân Lý</option>
                <option value="Valorant">🎯 Valorant</option>
                <option value="PUBG Mobile">🔫 PUBG Mobile</option>
                <option value="Liên Minh Huyền Thoại">🏆 Liên Minh Huyền Thoại</option>
                <option value="Khác">🎲 Game khác</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                💰 Giá bán (VNĐ)
              </label>
              <input
                type="number"
                name="price"
                value={price}
                onChange={onChange}
                placeholder="VD: 500000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                required
                min="1000"
              />
              <p className="text-xs text-gray-500 mt-1">Giá tối thiểu: 1,000đ</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📝 Mô tả chi tiết
              </label>
              <textarea
                name="description"
                value={description}
                onChange={onChange}
                placeholder="Mô tả chi tiết về nick: rank, tướng, skin, đá quý, vàng..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                rows={6}
                required
              />
              <p className="text-xs text-gray-500 mt-1">Mô tả càng chi tiết càng dễ bán</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🖼️ Hình ảnh (tối đa 5 ảnh)
              </label>
              <input
                type="file"
                name="images"
                onChange={onFileChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                multiple
                accept="image/*"
              />
              <div className="mt-4 grid grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(image)}
                    alt={`preview ${index}`}
                    className="w-full h-auto rounded-lg"
                  />
                ))}
              </div>
            </div>

            {/* Terms */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <input type="checkbox" required className="mt-1" />
                <div className="text-sm text-gray-600">
                  <p className="font-medium">📋 Điều khoản đăng bán:</p>
                  <ul className="mt-2 space-y-1 text-xs">
                    <li>• Nick phải là của bạn sở hữu hợp pháp</li>
                    <li>• Thông tin phải chính xác, không gian lận</li>
                    <li>• ShopT1 giữ 5% phí dịch vụ</li>
                    <li>• Tuân thủ quy định của ShopT1</li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              🚀 ĐĂNG BÁN NICK NGAY
            </button>
          </form>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-white bg-opacity-10 rounded-2xl p-6">
          <h3 className="text-white font-bold text-lg mb-4">💡 Mẹo bán nick nhanh:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white text-sm">
            <div>✅ Đặt giá hợp lý, cạnh tranh</div>
            <div>✅ Mô tả chi tiết, chính xác</div>
            <div>✅ Chụp ảnh màn hình rõ nét</div>
            <div>✅ Phản hồi khách hàng nhanh chóng</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewListingPage;
