import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSession } from '../hooks/useSession';
import { useAdmin } from '../hooks/useAdmin';
import Navbar from '../components/Navbar';
import Sidebar from '../components/admin/Sidebar';

export const ProtectedRoute = () => {
    const { sessionToken } = useSession();

    if (!sessionToken) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#0D0D0D]">
            <Navbar />
            <main className="flex-grow">
                <Outlet />
            </main>
        </div>
    );
};

export const AdminRoute = () => {
    const { adminToken, loading } = useAdmin();
    const location = useLocation();

    if (loading) {
        return <div className="min-h-screen bg-[#141414] flex items-center justify-center text-[#C9A84C]">Loading...</div>;
    }

    if (!adminToken) {
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    return (
        <div className="min-h-screen flex bg-[#141414] text-[#F0F0F0]">
            <Sidebar />
            <div className="flex-1 flex flex-col ml-64 min-h-screen overflow-y-auto">
                <main className="flex-1 p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
