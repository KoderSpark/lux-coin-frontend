import React from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/formatPrice';

const ListingCard = ({ listing }) => {
    const primaryImage = listing.images.find(img => img.isPrimary) || listing.images[0];

    // Extract one key spec to show
    const specEntries = listing.specifications ? Object.entries(listing.specifications) : [];
    const keySpec = specEntries.length > 0 ? `${specEntries[0][0]}: ${specEntries[0][1]}` : null;

    return (
        <div className="lux-card flex flex-col h-full group">
            <div className="relative h-64 overflow-hidden bg-gray-900 border-b border-[#C9A84C]/20">
                <img
                    src={primaryImage?.url || '/api/placeholder/400/300'}
                    alt={listing.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 text-xs font-semibold bg-[#0D0D0D]/80 text-[#C9A84C] border border-[#C9A84C]/50 rounded-full backdrop-blur-sm uppercase tracking-wider">
                        {listing.category}
                    </span>
                </div>
                {listing.isFeatured && (
                    <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 text-xs font-bold bg-[#C9A84C] text-[#0D0D0D] rounded-sm uppercase tracking-wide">
                            Featured
                        </span>
                    </div>
                )}
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-serif text-2xl text-white mb-2 line-clamp-2">{listing.title}</h3>

                <div className="mt-auto pt-4 space-y-4">
                    {keySpec && (
                        <p className="text-sm text-gray-400 border-l-2 border-[#C9A84C] pl-2">{keySpec}</p>
                    )}

                    <div className="flex items-center justify-between pt-2">
                        <span className="text-xl text-[#C9A84C] font-medium tracking-wide">
                            {listing.priceOnApplication ? 'Price on Application' : formatPrice(listing.price)}
                        </span>
                    </div>

                    <Link
                        to={`/portal/listings/${listing._id}`}
                        className="block w-full text-center px-4 py-2 mt-4 bg-transparent border border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0D0D0D] transition-all duration-300 font-medium tracking-widest text-sm uppercase"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ListingCard;
