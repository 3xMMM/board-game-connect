import { useAdminAuth } from "./AdminAuthContext";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { useEffect } from "react";
import AdminAuthProvider from "./AdminAuthProvider";

export default function RequireAdminAuth() {
    const { user } = useAdminAuth();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Require the User to login if they aren't logged in. The Admin Login page is the only Admin page that can be accessed without authentication.
        if (user === null && location.pathname !== '/admin/login') {
            navigate('/admin/login', {
                state: {
                    from: location,
                },
            });
        }
    }, [user, location, navigate]);

    return (
        <AdminAuthProvider>
            <Outlet/>
        </AdminAuthProvider>
    );
}