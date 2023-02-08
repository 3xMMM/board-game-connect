import { useAdminAuth } from "./AdminAuthContext";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { useEffect } from "react";
import AdminAuthProvider from "./AdminAuthProvider";
import Cookie from '../services/Cookie';
import ApiFetch from '../services/ApiFetch';
import { AdminUser } from '../spa';
import AdminNavbar from '../components/AdminNavbar';

interface SessionCheckResponse {
    sessionIsValid: boolean,
    user: AdminUser | {}
}

export default function RequireAdminAuth() {
    const adminAuth = useAdminAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const navigateToLoginPage = () => {
        navigate('/admin/login', {
            state: {
                from: location,
            },
        });
    };

    useEffect(() => {
        // Require the User to login if they aren't logged in. The Admin Login page is the only Admin page that can be accessed without authentication.
        if (adminAuth.user === null) {
            if (Cookie.getCookie('loggedIn')) {
                ApiFetch.get<SessionCheckResponse>('/api/admin/authentication/session-check')
                    .then(response => {
                        if (response && response.sessionIsValid && Object.keys(response.user).length > 0) {
                            adminAuth.setUser(response.user as AdminUser);
                            Cookie.setCookie('loggedIn', '1', 3);
                            if (location.pathname === '/admin/login') { // If you're on the login page and already logged-in, then just go to the dashboard
                                navigate('/admin/dashboard');
                            }
                        } else {
                            navigateToLoginPage();
                        }
                    }).catch(() => {
                        navigateToLoginPage();
                    });
            } else {
                navigateToLoginPage();
            }
        }
    }, [adminAuth.user]);

    return (
        <AdminAuthProvider>
            <AdminNavbar/>
        </AdminAuthProvider>
    );
}