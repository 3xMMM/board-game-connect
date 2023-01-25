import { useAdminAuth } from "../auth/AdminAuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@chakra-ui/react";

export default function AdminDashboard() {
    const auth = useAdminAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        auth.logout(() => {
            navigate('/admin/login');
        });
    }; 

    return (
        <div>
            <div>You're logged in!</div>
            <Button onClick={handleLogout}>Logout</Button>
        </div>
    );
}