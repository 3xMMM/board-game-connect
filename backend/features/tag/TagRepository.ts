import Tag from './Tag';
import pool from '../../utils/pool';

export const TagRepository = {
    getAll: async (): Promise<Tag[]> => {
        const query = {
            text: 'SELECT * FROM tags',
        };

        const queryResults = await pool.query<Tag>(query);
        return queryResults.rows.map(row => new Tag(row));
    },
    getByName: async (name: string): Promise<Tag> => {
        const query = {
            text: 'SELECT * FROM tags WHERE name = $1',
            values: [name],
        };

        const queryResults = await pool.query<Tag>(query);
        const rows = queryResults.rows;
        if (rows.length === 0) {
            throw new Error('Tag not found by name');
        }
        return new Tag(rows[0]);
    },
};
