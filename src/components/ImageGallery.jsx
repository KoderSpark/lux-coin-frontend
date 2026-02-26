import React, { useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';

const ImageGallery = ({ images }) => {
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    if (!images || images.length === 0) {
        return (
            <div className="w-full h-96 bg-gray-900 flex items-center justify-center">
                <span className="text-gray-500 font-serif">Image Unavailable</span>
            </div>
        );
    }

    // Sort images by order, primary first
    const sortedImages = [...images].sort((a, b) => {
        if (a.isPrimary) return -1;
        if (b.isPrimary) return 1;
        return a.order - b.order;
    });

    const nextImage = (e) => {
        e.stopPropagation();
        setActiveImageIndex((prev) => (prev === sortedImages.length - 1 ? 0 : prev + 1));
    };

    const prevImage = (e) => {
        e.stopPropagation();
        setActiveImageIndex((prev) => (prev === 0 ? sortedImages.length - 1 : prev - 1));
    };

    return (
        <>
            <div className="relative group w-full h-[50vh] md:h-[60vh] bg-black overflow-hidden cursor-pointer" onClick={() => setIsFullscreen(true)}>
                {/* Main Image */}
                <img
                    src={sortedImages[activeImageIndex].url}
                    alt={`Gallery ${activeImageIndex}`}
                    className="w-full h-full object-cover opacity-95 hover:opacity-100 transition-opacity duration-500"
                />

                {/* Navigation Overlays */}
                {sortedImages.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-[#C9A84C] text-white hover:text-black p-3 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                        >
                            <FiChevronLeft size={24} />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-[#C9A84C] text-white hover:text-black p-3 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                        >
                            <FiChevronRight size={24} />
                        </button>

                        {/* Indicators */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                            {sortedImages.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`w-2 h-2 rounded-full transition-all ${idx === activeImageIndex ? 'bg-[#C9A84C] scale-125' : 'bg-white/50'}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Thumbnails */}
            {sortedImages.length > 1 && (
                <div className="flex overflow-x-auto gap-2 p-2 bg-[#141414] hide-scrollbar">
                    {sortedImages.map((img, idx) => (
                        <div
                            key={idx}
                            onClick={(e) => { e.stopPropagation(); setActiveImageIndex(idx); }}
                            className={`flex-shrink-0 w-24 h-24 cursor-pointer border-2 transition-all ${idx === activeImageIndex ? 'border-[#C9A84C] opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                        >
                            <img src={img.url} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
            )}

            {/* Fullscreen Lightbox */}
            {isFullscreen && (
                <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
                    <button
                        onClick={() => setIsFullscreen(false)}
                        className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors z-50 p-2"
                    >
                        <FiX size={32} />
                    </button>

                    <img
                        src={sortedImages[activeImageIndex].url}
                        alt={`Fullscreen ${activeImageIndex}`}
                        className="max-h-screen max-w-full object-contain"
                    />

                    {sortedImages.length > 1 && (
                        <>
                            <button onClick={prevImage} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors">
                                <FiChevronLeft size={48} />
                            </button>
                            <button onClick={nextImage} className="absolute right-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors">
                                <FiChevronRight size={48} />
                            </button>
                        </>
                    )}
                </div>
            )}

            <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
        </>
    );
};

export default ImageGallery;
