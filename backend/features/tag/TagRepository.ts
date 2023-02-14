import Tag from './Tag';
import pool from '../../utils/pool';

export const TagRepository = {
    getAll: async (): Promise<Tag[]> => {
        const query = {
            text: 'SELECT * FROM tags ORDER BY name ASC',
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
    createMany: async (tags: string[]): Promise<Tag[]> => {
        const rows: Tag[] = [];
        tags.forEach(tag => {
            const query = {
                text: 'INSERT INTO tags VALUES ($1) RETURNING *',
                values: [tag],
            };
            pool.query<Tag>(query)
                .then(queryResults => rows.push(queryResults.rows[0]))
                .catch(e => {
                    console.error(e);
                    throw e;
                });
        });
        return rows.map(row => new Tag(row));
    },
};
