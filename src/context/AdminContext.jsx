import React, { createContext, useState, useEffect } from 'react';
import api from '../api';

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken') || null);
    const [adminProfile, setAdminProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            if (adminToken) {
                try {
                    const { data } = await api.get('/admin/me');
                    setAdminProfile(data);
                } catch (error) {
                    console.error("Token invalid or expired", error);
                    logoutAdmin();
                }
            }
            setLoading(false);
        };
        fetchProfile();
    }, [adminToken]);

    const loginAdmin = (token, profile) => {
        localStorage.setItem('adminToken', token);
        setAdminToken(token);
        setAdminProfile(profile);
    };

    const logoutAdmin = () => {
        localStorage.removeItem('adminToken');
        setAdminToken(null);
        setAdminProfile(null);
    };

    return (
        <AdminContext.Provider value={{ adminToken, adminProfile, loading, loginAdmin, logoutAdmin }}>
            {children}
        </AdminContext.Provider>
    );
};
