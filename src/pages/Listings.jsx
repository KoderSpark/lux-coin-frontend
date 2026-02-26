import React, { useEffect, useState } from 'react';
import api from '../api';
import ListingCard from '../components/ListingCard';

const Listings = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const categories = ['Islands', 'Luxury Cars', 'Chartered Flights', 'Helicopters', 'Luxury Watches'];
    const [selectedCategories, setSelectedCategories] = useState([]);

    // Notice we only fetch once and filter client-side for immediate feedback, 
    // or we could construct URL params and fetch again. Doing client side for speed since dataset might be small initially.

    useEffect(() => {
        fetchListings();
    }, []);

    const fetchListings = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/listings');
            setListings(data);
        } catch (error) {
            console.error('Failed to fetch listings', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleCategory = (cat) => {
        if (selectedCategories.includes(cat)) {
            setSelectedCategories(selectedCategories.filter(c => c !== cat));
        } else {
            setSelectedCategories([...selectedCategories, cat]);
        }
    };

    const filteredListings = listings.filter(l => {
        if (selectedCategories.length > 0 && !selectedCategories.includes(l.category)) return false;
        return true;
    });

    return (
        <div className="bg-[#0D0D0D] min-h-screen pt-8 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="mb-10 text-center">
                    <h1 className="font-serif text-4xl md:text-5xl text-white mb-4">Complete Collection</h1>
                    <div className="h-px bg-gradient-to-r from-transparent via-[#C9A84C]/50 to-transparent w-full max-w-lg mx-auto"></div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Sidebar Filters */}
                    <div className="lg:w-64 flex-shrink-0">
                        <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6 sticky top-28">
                            <h3 className="text-[#F0F0F0] font-medium tracking-wide uppercase mb-6 border-b border-[#333] pb-2">Refine</h3>

                            <div className="mb-8">
                                <h4 className="text-[#88888] text-sm mb-4">Categories</h4>
                                <div className="space-y-3">
                                    {categories.map(cat => (
                                        <label key={cat} className="flex items-center space-x-3 cursor-pointer group">
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedCategories.includes(cat)
                                                    ? 'bg-[#C9A84C] border-[#C9A84C]'
                                                    : 'bg-[#0D0D0D] border-[#444] group-hover:border-[#C9A84C]'
                                                }`}>
                                                {selectedCategories.includes(cat) && (
                                                    <svg className="w-3 h-3 text-[#0D0D0D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </div>
                                            <span className="text-gray-300 group-hover:text-white transition-colors">{cat}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Reset filters */}
                            {selectedCategories.length > 0 && (
                                <button
                                    onClick={() => setSelectedCategories([])}
                                    className="w-full py-2 text-xs uppercase tracking-widest text-gray-500 hover:text-[#C9A84C] border border-[#333] hover:border-[#C9A84C] rounded transition-all"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-6 text-gray-400 text-sm">
                            <span>Showing {filteredListings.length} {filteredListings.length === 1 ? 'Asset' : 'Assets'}</span>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-20">
                                <div className="w-12 h-12 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : filteredListings.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredListings.map(listing => (
                                    <ListingCard key={listing._id} listing={listing} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-12 text-center">
                                <p className="text-gray-400">No assets match your selected filters.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Listings;
