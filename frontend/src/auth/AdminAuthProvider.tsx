import { ReactNode, useState } from "react";
import ApiFetch from "../services/ApiFetch";
import { AdminUser } from "../spa";
import { AdminAuthContext } from "./AdminAuthContext";

export default function AdminAuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AdminUser | null>(null);

    const login = async (username: string, password: string, callback: (wasError: boolean) => void) => {
        const response = await ApiFetch.post<AdminUser>('/api/admin/authentication/login', { username, password });
        let error = true;
        if (response) {
            setUser(response);
            error = false;
        }
        callback(error);
    };

    const logout = async (callback: VoidFunction) => {
        await ApiFetch.post('/api/admin/logout');
        setUser(null);
        callback();
    };

    const value = { user, login, logout };

    return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}