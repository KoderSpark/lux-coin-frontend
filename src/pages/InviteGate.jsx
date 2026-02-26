import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useSession } from '../hooks/useSession';

const InviteGate = () => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useSession();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
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

                <form onSubmit={handleSubmit} className="space-y-6 opacity-0 animate-[fadeIn_2s_ease-out_2s_forwards]">
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
