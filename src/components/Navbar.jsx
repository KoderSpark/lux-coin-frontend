import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSession } from '../hooks/useSession';
import { FiLogOut } from 'react-icons/fi';

const Navbar = () => {
    const { sessionToken, logout } = useSession();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="sticky top-0 z-50 bg-[#1A1A1A]/90 backdrop-blur-md border-b border-[#C9A84C]/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <Link to="/portal" className="flex items-center space-x-2">
                        <span className="font-serif text-3xl text-[#C9A84C] tracking-widest font-bold">LUXCOIN</span>
                    </Link>

                    {sessionToken && (
                        <div className="flex items-center space-x-6">
                            <Link to="/portal" className="text-gray-300 hover:text-[#C9A84C] transition-colors font-medium">
                                Home
                            </Link>
                            <Link to="/portal/listings" className="text-gray-300 hover:text-[#C9A84C] transition-colors font-medium">
                                Collection
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center text-gray-400 hover:text-white transition-colors"
                                title="Exit Portal"
                            >
                                <FiLogOut className="w-5 h-5 mr-1" />
                                <span className="text-sm">Exit</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
