import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useSession } from '../hooks/useSession';

const InviteGate = () => {
    const [view, setView] = useState('enterCode'); // 'enterCode' or 'requestInvite'
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        why: '',
        occupation: ''
    });

    const { login } = useSession();
    const navigate = useNavigate();

    const handleCodeSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!code) {
            setError('Please enter your invite code.');
            return;
        }

        setLoading(true);
        try {
            const { data } = await api.post('/validate-code', { code });
            login(data.sessionToken);
            navigate('/portal');
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid or expired invite code.');
        } finally {
            setLoading(false);
        }
    };

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRequestSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!formData.name || !formData.phone || !formData.email || !formData.occupation) {
            setError('Please fill in all required fields.');
            return;
        }

        setLoading(true);
        try {
            await api.post('/invite-requests', formData);
            setSuccessMessage('Your request has been submitted successfully. We will contact you soon.');
            setFormData({ name: '', phone: '', email: '', why: '', occupation: '' });
            setTimeout(() => {
                setView('enterCode');
                setSuccessMessage('');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to submit request.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md text-center">
                <h1 className="font-serif text-5xl md:text-6xl text-[#C9A84C] tracking-[0.2em] mb-4 
                       opacity-0 animate-[fadeIn_2s_ease-out_forwards]">
                    LUXCOIN
                </h1>
                <p className="text-[#888888] tracking-widest text-sm uppercase mb-12
                      opacity-0 animate-[fadeIn_2s_ease-out_1s_forwards]">
                    The Exclusive Marketplace
                </p>

                {view === 'enterCode' ? (
                    <div className="opacity-0 animate-[fadeIn_2s_ease-out_2s_forwards]">
                        <form onSubmit={handleCodeSubmit} className="space-y-6">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                                    placeholder="ENTER INVITE CODE"
                                    className="w-full bg-transparent border-b border-[#333] py-3 text-center text-xl text-[#F0F0F0] tracking-widest focus:outline-none focus:border-[#C9A84C] transition-colors placeholder-[#444]"
                                    autoComplete="off"
                                    disabled={loading}
                                />
                            </div>

                            {error && (
                                <div className="text-red-500 text-sm tracking-wide animate-pulse">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="px-12 py-3 bg-transparent border border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0D0D0D] transition-all duration-500 tracking-[0.2em] uppercase text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Verifying...' : 'Enter'}
                            </button>
                        </form>

                        <div className="mt-8">
                            <button
                                onClick={() => { setView('requestInvite'); setError(''); setSuccessMessage(''); }}
                                className="text-[#888888] hover:text-[#C9A84C] transition-colors tracking-widest text-xs uppercase"
                            >
                                Request an Invite Code
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="animate-[fadeIn_0.5s_ease-out_forwards]">
                        <h2 className="text-[#C9A84C] font-serif text-xl mb-6 tracking-widest">REQUEST INVITE</h2>

                        {successMessage ? (
                            <div className="text-green-500 tracking-wide mb-6 p-4 border border-green-800 bg-green-900/20 rounded">
                                {successMessage}
                            </div>
                        ) : (
                            <form onSubmit={handleRequestSubmit} className="space-y-4 text-left">
                                <div>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleFormChange}
                                        placeholder="FULL NAME *"
                                        className="w-full bg-[#1A1A1A] border border-[#333] px-4 py-3 text-sm text-[#F0F0F0] tracking-widest focus:outline-none focus:border-[#C9A84C] transition-colors placeholder-[#555]"
                                        disabled={loading}
                                    />
                                </div>
                                <div>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleFormChange}
                                        placeholder="PHONE NUMBER *"
                                        className="w-full bg-[#1A1A1A] border border-[#333] px-4 py-3 text-sm text-[#F0F0F0] tracking-widest focus:outline-none focus:border-[#C9A84C] transition-colors placeholder-[#555]"
                                        disabled={loading}
                                    />
                                </div>
                                <div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleFormChange}
                                        placeholder="EMAIL ADDRESS *"
                                        className="w-full bg-[#1A1A1A] border border-[#333] px-4 py-3 text-sm text-[#F0F0F0] tracking-widest focus:outline-none focus:border-[#C9A84C] transition-colors placeholder-[#555]"
                                        disabled={loading}
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        name="occupation"
                                        value={formData.occupation}
                                        onChange={handleFormChange}
                                        placeholder="OCCUPATION *"
                                        className="w-full bg-[#1A1A1A] border border-[#333] px-4 py-3 text-sm text-[#F0F0F0] tracking-widest focus:outline-none focus:border-[#C9A84C] transition-colors placeholder-[#555]"
                                        disabled={loading}
                                    />
                                </div>
                                <div>
                                    <textarea
                                        name="why"
                                        value={formData.why}
                                        onChange={handleFormChange}
                                        placeholder="WHY DO YOU WANT TO JOIN? (OPTIONAL)"
                                        rows="3"
                                        className="w-full bg-[#1A1A1A] border border-[#333] px-4 py-3 text-sm text-[#F0F0F0] tracking-widest focus:outline-none focus:border-[#C9A84C] transition-colors placeholder-[#555] resize-none"
                                        disabled={loading}
                                    ></textarea>
                                </div>

                                {error && (
                                    <div className="text-red-500 text-sm tracking-wide text-center">
                                        {error}
                                    </div>
                                )}

                                <div className="flex flex-col gap-4 mt-6">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3 bg-[#C9A84C] text-[#0D0D0D] hover:bg-[#D4B55B] transition-colors tracking-[0.2em] uppercase text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Submitting...' : 'Submit Request'}
                                    </button>
                                    <button
                                        type="button"
                                        disabled={loading}
                                        onClick={() => { setView('enterCode'); setError(''); }}
                                        className="w-full py-3 bg-transparent border border-[#333] text-gray-400 hover:text-white hover:border-gray-500 transition-colors tracking-[0.2em] uppercase text-sm font-medium"
                                    >
                                        Back to Login
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                )}
            </div>

            <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
};

export default InviteGate;
