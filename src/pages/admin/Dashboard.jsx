import React, { useEffect, useState } from 'react';
import api from '../../api';
import { FiTrendingUp, FiUsers, FiKey, FiAlertCircle } from 'react-icons/fi';
import { format, parseISO } from 'date-fns';

const Dashboard = () => {
    const [stats, setStats] = useState({
        activeListings: 0,
        newInquiries: 0,
        totalInviteCodes: 0,
        codesUsedToday: 0
    });
    const [recentInquiries, setRecentInquiries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [listingsRes, inquiriesRes, codesRes] = await Promise.all([
                    api.get('/listings/admin/all'),
                    api.get('/inquiries/admin'),
                    api.get('/admin/invite-codes')
                ]);

                const activeListings = listingsRes.data.filter(l => l.status === 'active').length;
                const newInquiries = inquiriesRes.data.filter(i => i.status === 'new').length;
                const totalCodes = codesRes.data.length;

                // Very basic mock heuristic for today, since we don't track exact "used" time.
                // If it's used > 0 we'll count it. A real backend would need usage logs.
                const codesUsedToday = codesRes.data.filter(c => c.usageCount > 0).length;

                setStats({ activeListings, newInquiries, totalInviteCodes: totalCodes, codesUsedToday });
                setRecentInquiries(inquiriesRes.data.slice(0, 10)); // Just took top 10

            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const StatCard = ({ title, value, icon: Icon, colorClass }) => (
        <div className="bg-[#1A1A1A] border border-[#333] p-6 rounded-xl flex items-center justify-between shadow-lg">
            <div>
                <h3 className="text-gray-400 text-sm tracking-wider uppercase mb-2">{title}</h3>
                <p className="text-3xl font-serif text-white">{value}</p>
            </div>
            <div className={`p-4 rounded-full ${colorClass}`}>
                <Icon size={24} />
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="font-serif text-3xl text-white mb-1">Executive Dashboard</h1>
                    <p className="text-gray-400">Overview of platform metrics and activities.</p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-12 h-12 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        <StatCard title="Active Listings" value={stats.activeListings} icon={FiTrendingUp} colorClass="bg-blue-900/30 text-blue-500" />
                        <StatCard title="New Inquiries" value={stats.newInquiries} icon={FiAlertCircle} colorClass="bg-red-900/30 text-red-500" />
                        <StatCard title="Total Invites" value={stats.totalInviteCodes} icon={FiKey} colorClass="bg-purple-900/30 text-purple-500" />
                        <StatCard title="Usage Count" value={stats.codesUsedToday} icon={FiUsers} colorClass="bg-green-900/30 text-green-500" />
                    </div>

                    <div className="bg-[#1A1A1A] border border-[#333] rounded-xl overflow-hidden shadow-lg">
                        <div className="px-6 py-5 border-b border-[#333] flex justify-between items-center">
                            <h2 className="font-medium text-white tracking-wide">Recent Inquiries</h2>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-300">
                                <thead className="bg-[#222] text-xs uppercase text-gray-400 font-medium">
                                    <tr>
                                        <th className="px-6 py-4">Asset</th>
                                        <th className="px-6 py-4">Client</th>
                                        <th className="px-6 py-4">Type</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#333]">
                                    {recentInquiries.map(inquiry => (
                                        <tr key={inquiry._id} className="hover:bg-[#222] transition-colors">
                                            <td className="px-6 py-4 font-medium text-white truncate max-w-[200px]">{inquiry.listingTitle}</td>
                                            <td className="px-6 py-4">{inquiry.name}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-medium uppercase tracking-wider border ${inquiry.requestType === 'purchase'
                                                        ? 'bg-[#0D0D0D] text-[#C9A84C] border-[#C9A84C]'
                                                        : 'bg-[#1A1A1A] text-gray-300 border-gray-600'
                                                    }`}>
                                                    {inquiry.requestType}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-medium uppercase tracking-wider ${inquiry.status === 'new' ? 'bg-red-900/30 text-red-400 border border-red-800' :
                                                        inquiry.status === 'reviewed' ? 'bg-blue-900/30 text-blue-400 border border-blue-800' :
                                                            inquiry.status === 'in-progress' ? 'bg-yellow-900/30 text-yellow-500 border border-yellow-800' :
                                                                'bg-green-900/30 text-green-400 border border-green-800'
                                                    }`}>
                                                    {inquiry.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-400 whitespace-nowrap">
                                                {format(parseISO(inquiry.createdAt), 'MMM dd, yyyy')}
                                            </td>
                                        </tr>
                                    ))}
                                    {recentInquiries.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No inquiries found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;
