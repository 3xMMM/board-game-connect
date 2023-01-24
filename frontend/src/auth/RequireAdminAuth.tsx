import { useAdminAuth } from "./AdminAuthProvider";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { useEffect } from "react";

export default function RequireAdminAuth() {
    const auth = useAdminAuth();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (auth.user === null) {
            navigate('/admin/login', {
                state: {
                    from: location,
                },
            });
        }
    });

    return <Outlet/>;
}