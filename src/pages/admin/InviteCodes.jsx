import React, { useEffect, useState } from 'react';
import api from '../../api';
import { FiCopy, FiTrash2, FiToggleLeft, FiToggleRight, FiPlusCircle } from 'react-icons/fi';
import { format, parseISO } from 'date-fns';

const InviteCodes = () => {
    const [codes, setCodes] = useState([]);
    const [loading, setLoading] = useState(true);

    // Generation state
    const [quantity, setQuantity] = useState(1);
    const [usageLimit, setUsageLimit] = useState(1);
    const [notes, setNotes] = useState('');
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        fetchCodes();
    }, []);

    const fetchCodes = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/admin/invite-codes');
            setCodes(data);
        } catch (error) {
            console.error('Failed to fetch codes', error);
        } finally {
            setLoading(false);
        }
    };

    const generateCodes = async (e) => {
        e.preventDefault();
        setGenerating(true);
        try {
            await api.post('/admin/invite-codes', { quantity: Number(quantity), usageLimit: Number(usageLimit), notes });
            fetchCodes();
            // Reset form
            setQuantity(1);
            setUsageLimit(1);
            setNotes('');
        } catch (error) {
            console.error('Failed to generate codes', error);
            alert('Failed to generate codes. Check server connection.');
        } finally {
            setGenerating(false);
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'disabled' : 'active';
        try {
            const { data } = await api.patch(`/admin/invite-codes/${id}`, { status: newStatus });
            setCodes(codes.map(c => c._id === id ? data : c));
        } catch (error) {
            console.error('Failed to toggle status', error);
        }
    };

    const deleteCode = async (id) => {
        if (window.confirm('Delete this invite code forever?')) {
            try {
                await api.delete(`/admin/invite-codes/${id}`);
                setCodes(codes.filter(c => c._id !== id));
            } catch (error) {
                console.error('Failed to delete code', error);
            }
        }
    };

    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code);
        alert(`Copied ${code} to clipboard`);
    };

    return (
        <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
            <div className="flex justify-between items-end border-b border-[#333] pb-6">
                <div>
                    <h1 className="font-serif text-3xl text-white mb-1">Access Protocol</h1>
                    <p className="text-gray-400">Generate and manage exclusive platform access keys.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Generation Panel */}
                <div className="bg-[#1A1A1A] border border-[#333] p-6 rounded-xl h-fit sticky top-8 shadow-lg">
                    <h2 className="text-[#C9A84C] font-serif text-xl mb-6 flex items-center gap-2 border-b border-[#333] pb-3">
                        <FiPlusCircle /> Generate New Keys
                    </h2>
                    <form onSubmit={generateCodes} className="space-y-4">
                        <div>
                            <label className="lux-label">Quantity (Max 50)</label>
                            <input type="number" min="1" max="50" required value={quantity} onChange={e => setQuantity(e.target.value)} className="lux-input text-center font-mono text-lg" />
                        </div>
                        <div>
                            <label className="lux-label">Usage Limit Per Key</label>
                            <input type="number" min="1" required value={usageLimit} onChange={e => setUsageLimit(e.target.value)} className="lux-input text-center font-mono text-lg" />
                        </div>
                        <div>
                            <label className="lux-label">Notes (Optional)</label>
                            <input type="text" value={notes} onChange={e => setNotes(e.target.value)} placeholder="e.g. For Spring 2026 Event" className="lux-input" />
                        </div>
                        <button
                            type="submit"
                            disabled={generating}
                            className="w-full mt-4 bg-[#C9A84C] text-[#0D0D0D] py-3 rounded uppercase font-bold tracking-wider hover:bg-[#FFD700] transition-colors disabled:opacity-50"
                        >
                            {generating ? 'Processing...' : 'Execute Generation'}
                        </button>
                    </form>
                </div>

                {/* Database Table */}
                <div className="lg:col-span-2 bg-[#1A1A1A] border border-[#333] rounded-xl overflow-hidden shadow-lg">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-12 h-12 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-300">
                                <thead className="bg-[#222] text-xs uppercase text-gray-400 font-medium">
                                    <tr>
                                        <th className="px-6 py-4">Auth Code</th>
                                        <th className="px-6 py-4 text-center">Status</th>
                                        <th className="px-6 py-4 text-center">Usage</th>
                                        <th className="px-6 py-4">Created</th>
                                        <th className="px-6 py-4 text-right transform-none">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#333]">
                                    {codes.map(code => (
                                        <tr key={code._id} className="hover:bg-[#222]/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-mono text-white text-base tracking-wider">{code.code}</span>
                                                    <button onClick={() => copyToClipboard(code.code)} className="text-gray-500 hover:text-[#C9A84C] transition-colors">
                                                        <FiCopy />
                                                    </button>
                                                </div>
                                                {code.notes && <div className="text-xs text-gray-500 mt-1">{code.notes}</div>}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest border ${code.status === 'active' ? 'bg-green-900/20 text-green-400 border-green-800' :
                                                        code.status === 'expired' ? 'bg-gray-800 text-gray-400 border-gray-600' :
                                                            'bg-red-900/20 text-red-500 border-red-800'
                                                    }`}>
                                                    {code.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center font-mono">
                                                <span className={code.usageCount >= code.usageLimit ? 'text-red-400' : 'text-green-400'}>
                                                    {code.usageCount}
                                                </span> / {code.usageLimit}
                                            </td>
                                            <td className="px-6 py-4 text-gray-400">
                                                {format(parseISO(code.createdAt), 'MMM dd, yyyy')}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <button
                                                        onClick={() => toggleStatus(code._id, code.status)}
                                                        className={`p-2 transition-colors ${code.status === 'active' ? 'text-green-500 hover:text-red-500' : 'text-gray-500 hover:text-green-500'}`}
                                                        title={code.status === 'active' ? 'Disable' : 'Enable'}
                                                    >
                                                        {code.status === 'active' ? <FiToggleRight size={20} /> : <FiToggleLeft size={20} />}
                                                    </button>
                                                    <button
                                                        onClick={() => deleteCode(code._id)}
                                                        className="text-gray-500 hover:text-red-500 p-2 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <FiTrash2 />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InviteCodes;
