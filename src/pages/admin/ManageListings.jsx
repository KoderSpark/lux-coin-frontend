import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import { FiEdit2, FiTrash2, FiPlus, FiStar } from 'react-icons/fi';
import { formatPrice } from '../../utils/formatPrice';

const ManageListings = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchListings();
    }, []);

    const fetchListings = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/listings/admin/all');
            setListings(data);
        } catch (error) {
            console.error('Failed to fetch listings', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
            try {
                await api.delete(`/listings/admin/${id}`);
                setListings(listings.filter(l => l._id !== id));
            } catch (error) {
                console.error('Failed to delete listing', error);
            }
        }
    };

    const toggleFeatured = async (id, currentStatus) => {
        try {
            const { data } = await api.patch(`/listings/admin/${id}/status`, { isFeatured: !currentStatus });
            setListings(listings.map(l => l._id === id ? data : l));
        } catch (error) {
            console.error('Failed to update featured status', error);
        }
    };

    return (
        <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
            <div className="flex justify-between items-center border-b border-[#333] pb-6">
                <div>
                    <h1 className="font-serif text-3xl text-white mb-1">Asset Directory</h1>
                    <p className="text-gray-400">Manage all properties, vehicles, and items in the portfolio.</p>
                </div>
                <Link
                    to="/admin/listings/new"
                    className="flex items-center gap-2 bg-[#C9A84C] text-[#0D0D0D] px-6 py-2 rounded font-medium hover:bg-[#FFD700] transition-colors shadow-lg shadow-[#C9A84C]/20"
                >
                    <FiPlus /> New Asset
                </Link>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-12 h-12 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="bg-[#1A1A1A] border border-[#333] rounded-xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-300">
                            <thead className="bg-[#222] text-xs uppercase text-gray-400 font-medium">
                                <tr>
                                    <th className="px-6 py-4">Image</th>
                                    <th className="px-6 py-4 min-w-[200px]">Title</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Price</th>
                                    <th className="px-6 py-4 text-center">Featured</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-right transform-none">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#333]">
                                {listings.map(listing => (
                                    <tr key={listing._id} className="hover:bg-[#222]/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="w-16 h-12 bg-[#0D0D0D] rounded border border-[#333] overflow-hidden">
                                                {(listing.images && listing.images.length > 0) ? (
                                                    <img
                                                        src={listing.images.find(img => img.isPrimary)?.url || listing.images[0].url}
                                                        alt={listing.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-600">No Img</div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-white">{listing.title}</td>
                                        <td className="px-6 py-4">{listing.category}</td>
                                        <td className="px-6 py-4">{listing.priceOnApplication ? 'POA' : formatPrice(listing.price)}</td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => toggleFeatured(listing._id, listing.isFeatured)}
                                                className={`p-2 rounded-full transition-colors ${listing.isFeatured ? 'text-[#C9A84C] bg-[#C9A84C]/10' : 'text-gray-500 hover:text-gray-300'}`}
                                            >
                                                <FiStar className={listing.isFeatured ? 'fill-current' : ''} />
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2 py-1 rounded text-xs font-medium uppercase tracking-wider border ${listing.status === 'active' ? 'bg-green-900/30 text-green-400 border-green-800' :
                                                    listing.status === 'draft' ? 'bg-yellow-900/30 text-yellow-500 border-yellow-800' :
                                                        listing.status === 'sold' ? 'bg-red-900/30 text-red-500 border-red-800' :
                                                            'bg-gray-800 text-gray-400 border-gray-600'
                                                }`}>
                                                {listing.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <Link
                                                    to={`/admin/listings/${listing._id}/edit`}
                                                    className="text-gray-400 hover:text-[#C9A84C] p-2 transition-colors"
                                                    title="Edit"
                                                >
                                                    <FiEdit2 />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(listing._id)}
                                                    className="text-gray-400 hover:text-red-500 p-2 transition-colors"
                                                    title="Delete"
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {listings.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                            No assets found. Click "New Asset" to add one.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageListings;
