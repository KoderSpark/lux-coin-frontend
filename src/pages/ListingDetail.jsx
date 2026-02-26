import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import ImageGallery from '../components/ImageGallery';
import { formatPrice } from '../utils/formatPrice';
import InquiryModal from '../components/InquiryModal';

const ListingDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inquiryType, setInquiryType] = useState('enquiry');

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const { data } = await api.get(`/listings/${id}`);
                setListing(data);
            } catch (error) {
                console.error('Error fetching listing details', error);
                navigate('/portal/listings');
            } finally {
                setLoading(false);
            }
        };
        fetchListing();
    }, [id, navigate]);

    const openInquiry = (type) => {
        setInquiryType(type);
        setIsModalOpen(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
                <div className="w-16 h-16 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!listing) return null;

    return (
        <div className="bg-[#0D0D0D] min-h-screen pb-20">
            <ImageGallery images={listing.images} />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-12">
                <div className="flex flex-col md:flex-row justify-between items-start gap-8 border-b border-[#333] pb-8 mb-12">
                    <div className="flex-1">
                        <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold bg-[#1A1A1A] text-[#C9A84C] border border-[#C9A84C]/50 rounded-full uppercase tracking-widest">
                            {listing.category}
                        </span>
                        <h1 className="font-serif text-4xl md:text-5xl text-white mb-2 leading-tight">{listing.title}</h1>
                        {listing.status === 'sold' && (
                            <span className="text-red-500 font-bold uppercase tracking-widest text-sm py-1 border border-red-500 px-2 inline-block mt-2">Recently Sold</span>
                        )}
                    </div>

                    <div className="flex flex-col items-end shrink-0 w-full md:w-auto">
                        <div className="text-3xl text-[#C9A84C] font-medium tracking-wide mb-6">
                            {listing.priceOnApplication ? 'Price on Application' : formatPrice(listing.price)}
                        </div>

                        {listing.status === 'active' && (
                            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                                <button
                                    onClick={() => openInquiry('enquiry')}
                                    className="px-8 py-3 bg-transparent border border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0D0D0D] transition-all font-medium tracking-widest text-sm uppercase text-center"
                                >
                                    Enquire Now
                                </button>
                                <button
                                    onClick={() => openInquiry('purchase')}
                                    className="px-8 py-3 bg-[#C9A84C] border border-[#C9A84C] text-[#0D0D0D] hover:bg-[#FFD700] hover:border-[#FFD700] transition-all font-medium tracking-widest text-sm uppercase text-center shadow-[0_0_15px_#C9A84C33]"
                                >
                                    Purchase Request
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    <div className="lg:col-span-2 space-y-12">
                        <section>
                            <h2 className="font-serif text-3xl text-white mb-6">Overview</h2>
                            <div
                                className="prose prose-invert prose-p:text-gray-300 prose-p:leading-relaxed max-w-none prose-a:text-[#C9A84C] prose-img:rounded-md"
                                dangerouslySetInnerHTML={{ __html: listing.description }}
                            />
                        </section>
                    </div>

                    <div>
                        {listing.specifications && Object.keys(listing.specifications).length > 0 && (
                            <div className="bg-[#1A1A1A] border border-[#333] p-8 rounded-lg sticky top-28">
                                <h3 className="font-serif text-2xl text-white mb-6 border-b border-[#333] pb-4">Specifications</h3>
                                <dl className="space-y-4">
                                    {Object.entries(listing.specifications).map(([key, value]) => (
                                        <div key={key} className="flex flex-col border-b border-[#222] pb-3 last:border-0 last:pb-0">
                                            <dt className="text-sm text-gray-500 uppercase tracking-widest mb-1">{key}</dt>
                                            <dd className="text-gray-200 font-medium">{value}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <InquiryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                listing={listing}
                initialType={inquiryType}
            />
        </div>
    );
};

export default ListingDetail;
