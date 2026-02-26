import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
import api from '../api';

const InquiryModal = ({ isOpen, onClose, listing, initialType }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        country: '',
        requestType: initialType || 'enquiry',
        message: '',
        preferredContact: 'email'
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen || !listing) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('/inquiries', {
                ...formData,
                listingId: listing._id
            });
            setSuccess(true);
            setTimeout(() => {
                onClose();
                setSuccess(false);
                // Reset form
                setFormData({ ...formData, message: '' });
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to submit inquiry.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-[#1A1A1A] border border-[#C9A84C]/50 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col animate-[fadeIn_0.3s_ease-out]">

                {/* Header */}
                <div className="px-6 py-4 border-b border-[#333] flex justify-between items-center bg-[#141414]">
                    <div>
                        <h3 className="font-serif text-2xl text-white">
                            {formData.requestType === 'purchase' ? 'Purchase Request' : 'Direct Inquiry'}
                        </h3>
                        <p className="text-gray-400 text-sm mt-1">{listing.title}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <FiX className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                    {success ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-16 h-16 bg-green-900/30 border border-green-500 text-green-500 rounded-full flex items-center justify-center mb-6">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h4 className="font-serif text-2xl text-white mb-2">Request Received</h4>
                            <p className="text-gray-400">
                                Your private request has been securely submitted. A specialized agent will be in contact shortly.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {error && (
                                <div className="bg-red-900/20 border border-red-500/50 text-red-400 px-4 py-3 rounded text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="lux-label">Full Name *</label>
                                    <input required name="name" value={formData.name} onChange={handleChange} className="lux-input" placeholder="John Doe" />
                                </div>
                                <div>
                                    <label className="lux-label">Email Address *</label>
                                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="lux-input" placeholder="john@example.com" />
                                </div>
                                <div>
                                    <label className="lux-label">Phone Number</label>
                                    <input name="phone" value={formData.phone} onChange={handleChange} className="lux-input" placeholder="+1 (555) 000-0000" />
                                </div>
                                <div>
                                    <label className="lux-label">Country of Residence *</label>
                                    <input required name="country" value={formData.country} onChange={handleChange} className="lux-input" placeholder="e.g. United Kingdom" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="lux-label">Nature of Inquiry</label>
                                    <select name="requestType" value={formData.requestType} onChange={handleChange} className="lux-input">
                                        <option value="enquiry">General Inquiry</option>
                                        <option value="purchase">Purchase Intention</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="lux-label">Preferred Contact</label>
                                    <select name="preferredContact" value={formData.preferredContact} onChange={handleChange} className="lux-input">
                                        <option value="email">Email</option>
                                        <option value="phone">Phone Call</option>
                                        <option value="whatsapp">WhatsApp</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="lux-label">Message *</label>
                                <textarea
                                    required
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows="4"
                                    className="lux-input resize-none"
                                    placeholder="Please provide any specific requirements or questions..."
                                ></textarea>
                            </div>

                            <div className="pt-4 flex justify-end gap-4 border-t border-[#333]">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="lux-button-primary bg-[#C9A84C] text-[#0D0D0D] hover:bg-[#FFD700]"
                                >
                                    {loading ? 'Transmitting...' : 'Submit Request'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
      `}</style>
        </div>
    );
};

export default InquiryModal;
