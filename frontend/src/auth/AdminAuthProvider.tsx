import { ReactNode, useState } from "react";
import ApiFetch from "../services/ApiFetch";
import { AdminUser } from "../spa";
import { AdminAuthContext } from "./AdminAuthContext";
import Cookie from '../services/Cookie';

export default function AdminAuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AdminUser | null>(null);

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

    const logout = async (callback: VoidFunction) => {
        await ApiFetch.post('/api/admin/logout');
        setUser(null);
        Cookie.deleteCookie('loggedIn');
        callback();
    };

    const value = { user, setUser, login, logout };

    return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}