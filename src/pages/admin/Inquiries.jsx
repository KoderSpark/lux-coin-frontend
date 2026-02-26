import React, { useEffect, useState } from 'react';
import api from '../../api';
import { format, parseISO } from 'date-fns';
import { FiEye, FiMail, FiX } from 'react-icons/fi';

const Inquiries = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedInquiry, setSelectedInquiry] = useState(null);

    useEffect(() => {
        fetchInquiries();
    }, []);

    const fetchInquiries = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/inquiries/admin');
            setInquiries(data);
        } catch (error) {
            console.error('Failed to fetch inquiries', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            const { data } = await api.patch(`/inquiries/admin/${id}`, { status: newStatus });
            setInquiries(inquiries.map(i => i._id === id ? { ...i, status: data.status } : i));
            if (selectedInquiry?._id === id) {
                setSelectedInquiry({ ...selectedInquiry, status: data.status });
            }
        } catch (error) {
            console.error('Failed to update status', error);
        }
    };

    const updateNotes = async (id, notes) => {
        try {
            const { data } = await api.patch(`/inquiries/admin/${id}`, { adminNotes: notes });
            setInquiries(inquiries.map(i => i._id === id ? { ...i, adminNotes: data.adminNotes } : i));
        } catch (error) {
            console.error('Failed to update notes', error);
        }
    };

    return (
        <div className="flex h-[calc(100vh-4rem)] relative animate-[fadeIn_0.5s_ease-out]">
            {/* Main Table Area */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${selectedInquiry ? 'pr-[400px]' : ''}`}>
                <div className="flex justify-between items-end border-b border-[#333] pb-6 mb-6">
                    <div>
                        <h1 className="font-serif text-3xl text-white mb-1">Communications</h1>
                        <p className="text-gray-400">Manage client inquiries and purchase requests.</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="bg-[#1A1A1A] border border-[#333] rounded-xl overflow-hidden shadow-lg flex-1">
                        <div className="overflow-x-auto h-full CustomScrollbar">
                            <table className="w-full text-left text-sm text-gray-300">
                                <thead className="bg-[#222] text-xs uppercase text-gray-400 font-medium sticky top-0 z-10">
                                    <tr>
                                        <th className="px-6 py-4">Asset</th>
                                        <th className="px-6 py-4">Client</th>
                                        <th className="px-6 py-4">Location</th>
                                        <th className="px-6 py-4 text-center">Type</th>
                                        <th className="px-6 py-4 text-center">Status</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4 text-right transform-none">View</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#333]">
                                    {inquiries.map(inquiry => (
                                        <tr
                                            key={inquiry._id}
                                            className={`transition-colors cursor-pointer ${selectedInquiry?._id === inquiry._id ? 'bg-[#333]/50 border-l-2 border-l-[#C9A84C]' : 'hover:bg-[#222]/50 border-l-2 border-l-transparent'}`}
                                            onClick={() => setSelectedInquiry(inquiry)}
                                        >
                                            <td className="px-6 py-4 font-medium text-white max-w-[200px] truncate">{inquiry.listingTitle}</td>
                                            <td className="px-6 py-4">
                                                <div>{inquiry.name}</div>
                                                <div className="text-xs text-gray-500 truncate max-w-[150px]">{inquiry.email}</div>
                                            </td>
                                            <td className="px-6 py-4">{inquiry.country}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest border ${inquiry.requestType === 'purchase' ? 'bg-[#0D0D0D] text-[#C9A84C] border-[#C9A84C]' : 'bg-[#1A1A1A] text-gray-400 border-gray-600'
                                                    }`}>
                                                    {inquiry.requestType}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-2 py-1 rounded text-xs font-medium uppercase tracking-wider ${inquiry.status === 'new' ? 'text-red-400' :
                                                        inquiry.status === 'reviewed' ? 'text-blue-400' :
                                                            inquiry.status === 'in-progress' ? 'text-yellow-500' :
                                                                'text-green-400'
                                                    }`}>
                                                    {inquiry.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                                                {format(parseISO(inquiry.createdAt), 'MMM dd')}
                                            </td>
                                            <td className="px-6 py-4 text-right transform-none">
                                                <button className="text-[#C9A84C] hover:text-[#FFD700] p-2">
                                                    <FiEye />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {inquiries.length === 0 && (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-12 text-center text-gray-500">No communications found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Detail Slide-in Panel */}
            <div
                className={`fixed top-0 right-0 h-screen w-[400px] bg-[#141414] border-l border-[#333] shadow-2xl transition-transform duration-300 ease-in-out z-50 flex flex-col ${selectedInquiry ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {selectedInquiry && (
                    <>
                        <div className="p-6 border-b border-[#333] flex justify-between items-center bg-[#1A1A1A]">
                            <h2 className="font-serif text-2xl text-white">Inquiry Details</h2>
                            <button onClick={() => setSelectedInquiry(null)} className="text-gray-400 hover:text-white p-2">
                                <FiX size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">

                            {/* Asset & Client Info */}
                            <div className="space-y-4">
                                <div>
                                    <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Target Asset</div>
                                    <div className="text-lg text-[#C9A84C] font-medium">{selectedInquiry.listingTitle}</div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 bg-[#1A1A1A] p-4 rounded border border-[#333]">
                                    <div>
                                        <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Client</div>
                                        <div className="text-white">{selectedInquiry.name}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Location</div>
                                        <div className="text-white">{selectedInquiry.country}</div>
                                    </div>
                                    <div className="col-span-2">
                                        <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Contact Details</div>
                                        <div className="text-white">{selectedInquiry.email}</div>
                                        {selectedInquiry.phone && <div className="text-gray-400 mt-1">{selectedInquiry.phone}</div>}
                                    </div>
                                    <div className="col-span-2">
                                        <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Preferred Method</div>
                                        <div className="text-white capitalize inline-flex items-center gap-2">
                                            {selectedInquiry.preferredContact}
                                            {selectedInquiry.preferredContact === 'whatsapp' && <span className="w-2 h-2 rounded-full bg-green-500"></span>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Message */}
                            <div>
                                <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Message Content</div>
                                <div className="bg-[#1A1A1A] p-4 rounded border border-[#333] text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                                    {selectedInquiry.message}
                                </div>
                            </div>

                            {/* Status Update */}
                            <div>
                                <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Current Status</div>
                                <select
                                    value={selectedInquiry.status}
                                    onChange={(e) => updateStatus(selectedInquiry._id, e.target.value)}
                                    className="w-full bg-[#1A1A1A] border border-[#333] rounded px-4 py-3 text-white focus:outline-none focus:border-[#C9A84C] transition-colors appearance-none"
                                >
                                    <option value="new">New</option>
                                    <option value="reviewed">Reviewed</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="closed">Closed / Resolved</option>
                                </select>
                            </div>

                            {/* Admin Notes */}
                            <div>
                                <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Internal Notes</div>
                                <textarea
                                    defaultValue={selectedInquiry.adminNotes}
                                    onBlur={(e) => updateNotes(selectedInquiry._id, e.target.value)}
                                    placeholder="Add private notes here... (Auto-saves on blur)"
                                    className="w-full bg-[#1A1A1A] border border-[#333] rounded px-4 py-3 text-white focus:outline-none focus:border-[#C9A84C] transition-colors resize-vertical min-h-[120px] text-sm"
                                />
                            </div>

                            {/* Actions */}
                            <div className="pt-4 border-t border-[#333]">
                                <a
                                    href={`mailto:${selectedInquiry.email}?subject=Regarding your inquiry for ${selectedInquiry.listingTitle}`}
                                    className="flex items-center justify-center gap-2 w-full bg-[#0D0D0D] border border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0D0D0D] py-3 rounded uppercase font-bold tracking-wider transition-colors"
                                >
                                    <FiMail /> Compose Email Response
                                </a>
                            </div>

                        </div>
                    </>
                )}
            </div>

            <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
      `}</style>
        </div>
    );
};

export default Inquiries;
