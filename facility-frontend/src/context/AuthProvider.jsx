import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { authAPIs, endpoints } from '../configs/APIs';
import cookie from "react-cookies";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = (userData, token) => {
        // Lưu token vào cookie
        cookie.save('jwtToken', token, { path: '/' });
        console.log("Token:", token);

        // Thiết lập header mặc định cho axios
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Lưu thông tin user vào context
        setUser(userData);
    };

    const logout = () => {
        cookie.remove('jwtToken', { path: '/' });
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    const loadUser = async () => {
        const token = cookie.load('jwtToken');

        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await authAPIs().get(endpoints['current-user']);
            // Lưu thông tin cần thiết
            const currentUser = {
                id: response.data.userId,
                name: response.data.fullName || response.data.name,
                role: response.data.role,
                avatar: response.data.avatar
            };
            setUser(currentUser);
        } catch (error) {
            console.error('Lỗi khi load user:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUser();
    }, [cookie.load("jwtToken")]);

    return (
        <AuthContext.Provider value={{ user, loading, logout, login, loadUser }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook dùng trong các component
export const useAuth = () => useContext(AuthContext);
