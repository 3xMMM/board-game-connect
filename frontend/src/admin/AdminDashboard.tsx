import { useAdminAuth } from "../auth/AdminAuthContext";
import { Button } from "@chakra-ui/react";

export default function AdminDashboard() {
    const auth = useAdminAuth();
    return (
        <div>
            <div>You're logged in!</div>
            <Button onClick={auth.logout}>Logout</Button>
        </div>
    );
}
