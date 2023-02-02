import pool from '../../../utils/pool';
import AdminUser from './AdminUser';

export const AdminUserRepository = {
    getById: async (userId: number): Promise<AdminUser> => {
        const query = {
            text: 'SELECT * FROM admin_users WHERE id = $1',
            values: [userId],
        };

        const queryResults = await pool.query<AdminUser>(query);
        const rows = queryResults.rows;
        if (rows.length === 0) {
            throw new Error('User not found by ID');
        }
        return new AdminUser(rows[0]);
    },

    getByUsername: async (username: string): Promise<AdminUser> => {
        const query = {
            text: 'SELECT * FROM admin_users WHERE username = $1',
            values: [username],
        };

        const queryResults = await pool.query<AdminUser>(query);
        const rows = queryResults.rows;
        if (rows.length === 0) {
            throw new Error('User not found by Username');
        }
        return new AdminUser(rows[0]);
    },

    updateLastLogin: (user: AdminUser): void => {
        void pool.query('UPDATE admin_users SET last_login = current_timestamp WHERE id = $1', [user.id]);
    },
};

export default AdminUserRepository;
