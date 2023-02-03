import { useAdminAuth } from "../auth/AdminAuthContext";
import { Button } from "@chakra-ui/react";
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
    const auth = useAdminAuth();
    return (
        <div>
            <div>You're logged in!</div>
            <Link to="/admin/tags"><Button>Go to Tags</Button></Link>
            <Button onClick={auth.logout}>Logout</Button>
        </div>
    );
}
