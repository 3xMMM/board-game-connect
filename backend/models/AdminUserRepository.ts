import pool from '../utils/pool';
import AdminUser from './AdminUser';

export const AdminUserRepository = {
    getByUsername: async (username: string): Promise<AdminUser | null> => {
        const query = {
            text: 'SELECT * FROM admin_users WHERE username = $1',
            values: [username],
        };

        const queryResults = await pool.query<AdminUser>(query);
        const rows = queryResults.rows;
        if (rows.length > 0) {
            return new AdminUser(rows[0]);
        }
        return null;
    },
    updateLastLogin: (user: AdminUser): void => {
        void pool.query('UPDATE admin_users SET last_login = current_timestamp WHERE id = $1', [user.id]);
    },
};

export default AdminUserRepository;
