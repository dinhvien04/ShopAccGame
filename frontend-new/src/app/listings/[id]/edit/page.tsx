'use client';

import { useState, useEffect } from 'react';
import api, { setAuthToken } from '@/services/api';
import { useRouter, useParams } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  user: {
    id: string;
  }
}

const EditListingPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    game: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    setAuthToken(token);
    const decoded = jwtDecode<DecodedToken>(token);

    api.get(`/listings/${id}`)
      .then(res => {
        // Authorization check: ensure the user owns the listing
        if (res.data.seller._id !== decoded.user.id) {
          alert('You are not authorized to edit this listing.');
          router.push(`/listings/${id}`);
          return;
        }
        const { title, description, price, game } = res.data;
        setFormData({ title, description, price: price.toString(), game });
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        alert('Could not fetch listing data.');
        router.push('/');
      });
  }, [id, router]);

  const { title, description, price, game } = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await api.put(`/listings/${id}`, { ...formData, price: Number(price) });
      alert('Listing updated successfully!');
      router.push(`/listings/${id}`);
    } catch (err: any) {
      console.error(err);
      alert(`Error: ${err.response?.data?.errors[0]?.msg || 'Could not update listing.'}`);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Edit Listing</h1>
      <form className="space-y-4" onSubmit={onSubmit}>
        {/* Form fields are identical to NewListingPage */}
        <div>
          <label className="block mb-1">Title</label>
          <input type="text" name="title" value={title} onChange={onChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block mb-1">Game</label>
          <input type="text" name="game" value={game} onChange={onChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block mb-1">Price ($)</label>
          <input type="number" name="price" value={price} onChange={onChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block mb-1">Description</label>
          <textarea name="description" value={description} onChange={onChange} className="w-full border rounded px-3 py-2" rows={5} required></textarea>
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditListingPage;
