import React, { useEffect, useState } from 'react';
import api from '../../api';
import { format, parseISO } from 'date-fns';
import { FiRefreshCw, FiMail } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const InviteRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRequests = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.get('/invite-requests/admin');
            setRequests(data.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch invite requests');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const getWhatsAppLink = (phone, name) => {
        const text = encodeURIComponent(`Hello ${name}, your request to join LuxCoin has been approved! Your Invite Code is: [INSERT_CODE_HERE]. Welcome to the exclusive marketplace.`);
        let cleanPhone = phone.replace(/\D/g, '');

        // Add India country code '91' if the user just entered a 10-digit number
        if (cleanPhone.length === 10) {
            cleanPhone = `91${cleanPhone}`;
        }

        return `https://wa.me/${cleanPhone}?text=${text}`;
    };

    const getMailtoLink = (email, name) => {
        const subject = encodeURIComponent('LuxCoin - Invite Request Approved');
        const body = encodeURIComponent(`Hello ${name},\n\nYour request to join LuxCoin has been approved!\n\nYour Invite Code is: [INSERT_CODE_HERE]\n\nWelcome to the exclusive marketplace.`);
        return `mailto:${email}?subject=${subject}&body=${body}`;
    };

    return (
        <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="font-serif text-3xl text-white mb-1">Invite Requests</h1>
                    <p className="text-gray-400">View requests for platform access.</p>
                </div>
                <button
                    onClick={fetchRequests}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] text-gray-300 border border-[#333] hover:text-white hover:border-[#C9A84C] transition-colors rounded disabled:opacity-50"
                >
                    <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {error && (
                <div className="p-4 bg-red-900/30 border border-red-800 text-red-400 rounded-md">
                    {error}
                </div>
            )}

            <div className="bg-[#1A1A1A] border border-[#333] rounded-xl overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-300">
                        <thead className="bg-[#222] text-xs uppercase text-gray-400 font-medium border-b border-[#333]">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Contact</th>
                                <th className="px-6 py-4">Occupation</th>
                                <th className="px-6 py-4">Why</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#333]">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                        Loading requests...
                                    </td>
                                </tr>
                            ) : requests.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                        No invite requests found.
                                    </td>
                                </tr>
                            ) : (
                                requests.map(req => (
                                    <tr key={req._id} className="hover:bg-[#222] transition-colors">
                                        <td className="px-6 py-4 font-medium text-white">{req.name}</td>
                                        <td className="px-6 py-4">
                                            <div>{req.email}</div>
                                            <div className="text-gray-500 text-xs mt-1">{req.phone}</div>
                                        </td>
                                        <td className="px-6 py-4">{req.occupation}</td>
                                        <td className="px-6 py-4 max-w-xs truncate" title={req.why}>
                                            {req.why || <span className="text-gray-600 italic">Not provided</span>}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                                            {format(parseISO(req.createdAt), 'MMM dd, yyyy')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-medium uppercase tracking-wider ${req.status === 'pending' ? 'bg-yellow-900/30 text-yellow-500 border border-yellow-800' :
                                                req.status === 'reviewed' ? 'bg-blue-900/30 text-blue-400 border border-blue-800' :
                                                    req.status === 'approved' ? 'bg-green-900/30 text-green-400 border border-green-800' :
                                                        'bg-red-900/30 text-red-400 border border-red-800'
                                                }`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <a
                                                    href={getWhatsAppLink(req.phone, req.name)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 bg-green-900/20 text-green-500 hover:bg-green-900/40 hover:text-green-400 border border-green-800/50 hover:border-green-500 transition-all rounded"
                                                    title="Send WhatsApp Message"
                                                >
                                                    <FaWhatsapp size={16} />
                                                </a>
                                                <a
                                                    href={getMailtoLink(req.email, req.name)}
                                                    className="p-2 bg-blue-900/20 text-blue-500 hover:bg-blue-900/40 hover:text-blue-400 border border-blue-800/50 hover:border-blue-500 transition-all rounded"
                                                    title="Send Email"
                                                >
                                                    <FiMail size={16} />
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InviteRequests;
