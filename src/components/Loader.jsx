import React from 'react';

const Loader = () => {
    return (
        <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center">
            {/* Elegant glowing spinner matching LuxCoin theme */}
            <div className="relative w-16 h-16">
                {/* Outer rotating ring */}
                <div className="absolute inset-0 border-4 border-t-[#C9A84C] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                {/* Inner slower rotating ring */}
                <div className="absolute inset-2 border-2 border-[#333] border-b-[#888] rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>
            </div>

            {/* Loading text with pulse effect */}
            <div className="mt-8 flex flex-col items-center">
                <span className="font-serif text-[#C9A84C] tracking-[0.2em] text-lg animate-pulse">LUXCOIN</span>
                <span className="text-[#555] tracking-[0.3em] text-[10px] mt-2 uppercase">Loading...</span>
            </div>
        </div>
    );
};

export default Loader;
