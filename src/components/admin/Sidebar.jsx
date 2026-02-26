import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAdmin } from '../../hooks/useAdmin';
import {
    FiGrid,
    FiList,
    FiKey,
    FiMessageSquare,
    FiLogOut
} from 'react-icons/fi';

const Sidebar = () => {
    const { logoutAdmin, adminProfile } = useAdmin();
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutAdmin();
        navigate('/admin/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: FiGrid },
        { name: 'Listings', path: '/admin/listings', icon: FiList },
        { name: 'Invite Codes', path: '/admin/invite-codes', icon: FiKey },
        { name: 'Inquiries', path: '/admin/inquiries', icon: FiMessageSquare },
    ];

    return (
        <div className="fixed inset-y-0 left-0 w-64 bg-[#0D0D0D] border-r border-[#333] flex flex-col">
            <div className="p-6 border-b border-[#333] flex items-center justify-center">
                <span className="font-serif text-2xl text-[#C9A84C] tracking-widest font-bold">LUXCOIN</span>
                <span className="ml-2 text-xs font-sans text-gray-500 uppercase tracking-widest border border-gray-700 px-1 rounded">Admin</span>
            </div>

            <div className="py-6 flex-1 flex flex-col gap-2 px-4">
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 ${isActive
                                ? 'bg-[#1A1A1A] text-[#C9A84C] border-l-2 border-[#C9A84C]'
                                : 'text-gray-400 hover:bg-[#1A1A1A] hover:text-[#F0F0F0] border-l-2 border-transparent'
                            }`
                        }
                    >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium tracking-wide">{item.name}</span>
                    </NavLink>
                ))}
            </div>

            <div className="p-6 border-t border-[#333]">
                <div className="mb-4 text-xs text-gray-500 truncate">
                    {adminProfile?.email}
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors w-full p-2"
                >
                    <FiLogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
