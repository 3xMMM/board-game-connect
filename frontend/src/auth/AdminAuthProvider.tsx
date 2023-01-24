import { createContext, ReactNode, useContext, useState } from "react";
import ApiFetch from "../services/ApiFetch";
import { AdminUser } from "../spa";

export interface AdminAuthContextType {
    user: AdminUser | null
    login: (username: string, password: string, callback: VoidFunction) => void
    logout: (callback: VoidFunction) => void
}

const AuthContext = createContext<AdminAuthContextType>({
    user: null,
    login: () => {},
    logout: () => {},
});

export function useAdminAuth() {
    return useContext(AuthContext);
}

export default function AdminAuthProvider({ children }: { children: ReactNode }) {
    let [user, setUser] = useState<AdminUser | null>(null);

    let login = async (username: string, password: string, callback: VoidFunction) => {
        const response = await ApiFetch.post<AdminUser>('/api/admin/login', { username, password });
        setUser(response);
        callback();
    };

    let logout = async (callback: VoidFunction) => {
        await ApiFetch.post('/api/admin/logout');
        setUser(null);
        callback();
    };

    let value = { user, login, logout };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}