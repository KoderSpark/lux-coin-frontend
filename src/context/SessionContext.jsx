import React, { createContext, useState, useEffect } from 'react';

export const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
    const [sessionToken, setSessionToken] = useState(localStorage.getItem('sessionToken') || null);

    const login = (token) => {
        localStorage.setItem('sessionToken', token);
        setSessionToken(token);
    };

    const logout = () => {
        localStorage.removeItem('sessionToken');
        setSessionToken(null);
    };

    return (
        <SessionContext.Provider value={{ sessionToken, login, logout }}>
            {children}
        </SessionContext.Provider>
    );
};
