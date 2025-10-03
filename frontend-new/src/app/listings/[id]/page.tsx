'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api, { setAuthToken } from '@/services/api';

interface Listing {
  _id: string;
  title: string;
  description: string;
  price: number;
  game: string;
  seller: {
    _id: string;
    name: string;
  };
}

import { jwtDecode } from 'jwt-decode';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface DecodedToken {
  user: {
    id: string;
  }
}

interface Listing {
  _id: string;
  title: string;
  description: string;
  price: number;
  game: string;
  status: string;
  seller: {
    _id: string;
    name: string;
  };
}

const ListingDetailPage = () => {
  const [listing, setListing] = useState<Listing | null>(null);
  const [currentUser, setCurrentUser] = useState<{id: string} | null>(null);
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      const decoded = jwtDecode<DecodedToken>(token);
      setCurrentUser(decoded.user);
    }

    if (id) {
      const fetchListing = async () => {
        try {
          const res = await api.get(`/listings/${id}`);
          setListing(res.data);
        } catch (err) {
          console.error('Error fetching listing:', err);
        }
      };
      fetchListing();
    }
  }, [id]);

  const handleBuy = async () => {
    if (!currentUser) {
      alert('Please log in to purchase an item.');
      return;
    }
    try {
      const res = await api.post(`/transactions/buy/${id}`);
      alert('Purchase successful! Transaction initiated.');
      router.push('/transactions/my');
    } catch (err: any) {
      console.error('Error purchasing item:', err);
      alert(`Error: ${err.response?.data?.msg || 'Could not complete purchase.'}`);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
        try {
            await api.delete(`/listings/${id}`);
            alert('Listing deleted successfully');
            router.push('/');
        } catch (err: any) {
            alert(`Error: ${err.response?.data?.msg || 'Could not delete listing.'}`);
        }
    }
  }

  if (!listing) {
    return <div>Loading...</div>;
  }

  const isOwner = currentUser && currentUser.id === listing.seller._id;
  const canBeBought = listing.status === 'Available' && currentUser && !isOwner;

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-4">{listing.title}</h1>
        <p className="text-gray-600 mb-2">Sold by: {listing.seller.name}</p>
        <p className="text-lg mb-4">{listing.description}</p>
        <p className="text-2xl font-bold text-blue-600 mb-6">${listing.price}</p>
        
        {canBeBought && (
            <button 
              onClick={handleBuy}
              className="w-full bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors duration-200 mb-4"
            >
              Buy Now
            </button>
        )}

        {isOwner && (
            <div className="flex space-x-4">
                <Link href={`/listings/${id}/edit`} className="flex-1 text-center bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600">
                    Edit
                </Link>
                <button 
                    onClick={handleDelete}
                    className="flex-1 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
                >
                    Delete
                </button>
            </div>
        )}

      </div>
    </div>
  );
};

export default ListingDetailPage;
