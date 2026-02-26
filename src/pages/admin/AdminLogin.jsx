import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../hooks/useAdmin';
import api from '../../api';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { loginAdmin } = useAdmin();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { data } = await api.post('/admin/login', { email, password });
            loginAdmin(data.token, { email: data.email, _id: data._id });
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#1A1A1A] border border-[#333] p-8 rounded-lg shadow-2xl relative overflow-hidden">

                {/* Decorative top border */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent"></div>

                <div className="text-center mb-10">
                    <h2 className="font-serif text-3xl text-[#C9A84C] tracking-widest mb-2">LUXCOIN</h2>
                    <p className="text-gray-500 text-sm tracking-widest uppercase">Admin Terminal</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-900/20 border border-red-500/50 text-red-400 px-4 py-3 rounded text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-gray-400 text-sm font-medium mb-2">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-[#0D0D0D] border border-[#333] rounded px-4 py-3 text-white focus:outline-none focus:border-[#C9A84C] transition-colors"
                            placeholder="admin@luxcoin.com"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 text-sm font-medium mb-2">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-[#0D0D0D] border border-[#333] rounded px-4 py-3 text-white focus:outline-none focus:border-[#C9A84C] transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#C9A84C] text-[#0D0D0D] py-3 rounded font-medium tracking-wide hover:bg-[#FFD700] transition-colors mt-4 disabled:opacity-50"
                    >
                        {loading ? 'Authenticating...' : 'Access Terminal'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
