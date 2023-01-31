import { ReactNode, useEffect, useState } from "react";
import ApiFetch from "../services/ApiFetch";
import { AdminUser } from "../spa";
import { AdminAuthContext } from "./AdminAuthContext";
import Cookie from '../services/Cookie';
import { useNavigate } from 'react-router-dom';

export default function AdminAuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AdminUser | null>(null);
    const navigate = useNavigate();

    const login = async (username: string, password: string, callback: (wasError: boolean) => void) => {
        const response = await ApiFetch.post<AdminUser>('/api/admin/authentication/login', { username, password });
        let error = true;
        if (response) {
            setUser(response);
            Cookie.setCookie('loggedIn', '1', 3);
            error = false;
        }
        callback(error);
    };

    const logout = async () => {
        Cookie.deleteCookie('loggedIn');
        setUser(null);
        await ApiFetch.post('/api/admin/authentication/logout');
        navigate('/admin/login', { replace: true });
    };

    const value = { user, setUser, login, logout };

    return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}