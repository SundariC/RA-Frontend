import React, { createContext, useContext, useState, useEffect } from 'react';


const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token= localStorage.getItem("token");
        const userID = localStorage.getItem("userID");
        const username = localStorage.getItem("username");
        const email = localStorage.getItem("email");
        if (token && userID ) {
            setUser({ token, userID, username, email });
        }
        setLoading(false);
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userID");
        localStorage.removeItem("username");
        localStorage.removeItem("email");
        setUser(null);
        window.location.href = "/auth";
    };
    return (
        <AuthContext.Provider value={{ user, setUser, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);