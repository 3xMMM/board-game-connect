import { useAdminAuth } from "../auth/AdminAuthContext";
import { Button } from "@chakra-ui/react";

export default function AdminDashboard() {
    const auth = useAdminAuth();

    const handleLogout = () => {
        auth.logout();
    }; 

    return (
        <div>
            <div>You're logged in!</div>
            <Button onClick={handleLogout}>Logout</Button>
        </div>
    );
}
