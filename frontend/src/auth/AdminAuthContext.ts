import { AdminUser } from "../spa";
import { createContext, useContext } from "react";

interface AdminAuthContextType {
    user: AdminUser | null
    login: (username: string, password: string, callback: (wasError: boolean) => void) => void
    logout: (callback: VoidFunction) => void
}

export const AdminAuthContext = createContext<AdminAuthContextType>({
    user: null,
    login: () => {},
    logout: () => {},
});

export function useAdminAuth() {
    return useContext(AdminAuthContext);
}
