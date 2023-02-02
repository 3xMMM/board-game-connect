import { AdminUser } from "../spa";
import { createContext, useContext } from "react";

interface AdminAuthContextType {
    user: AdminUser | null
    setUser: (user: AdminUser) => void
    login: (username: string, password: string, callback: (wasError: boolean) => void) => void
    logout: () => void
}

export const AdminAuthContext = createContext<AdminAuthContextType>({
    user: null,
    setUser: () => {},
    login: () => {},
    logout: () => {},
});

export function useAdminAuth() {
    return useContext(AdminAuthContext);
}
