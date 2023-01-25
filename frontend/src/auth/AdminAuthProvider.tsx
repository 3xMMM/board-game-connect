import { ReactNode, useState } from "react";
import ApiFetch from "../services/ApiFetch";
import { AdminUser } from "../spa";
import { AdminAuthContext } from "./AdminAuthContext";

export default function AdminAuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AdminUser | null>(null);

    const login = async (username: string, password: string, callback: VoidFunction) => {
        const response = await ApiFetch.post<AdminUser>('/api/admin/login', { username, password });
        if (response) {
            setUser(response);
        } else {
            setUser(null);
        }

        callback();
    };

    const logout = async (callback: VoidFunction) => {
        await ApiFetch.post('/api/admin/logout');
        setUser(null);
        callback();
    };

    const value = { user, login, logout };

    return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}