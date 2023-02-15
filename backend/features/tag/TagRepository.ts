import Tag from './Tag';
import pool from '../../utils/pool';
import { DatabaseError } from 'pg';

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
        const duplicateTags = new Set<string>();

        for (let i = 0; i < tags.length; i++) {
            const tag = tags[i];
            const query = {
                text: 'INSERT INTO tags VALUES ($1) RETURNING *',
                values: [tag],
            };
            try {
                const queryResults = await pool.query<Tag>(query);
                rows.push(queryResults.rows[0]);
            } catch (e) {
                if (e instanceof DatabaseError && e.code === '23505') {
                    duplicateTags.add(tag);
                } else {
                    throw e;
                }
            }
        }

        if (duplicateTags.size > 0) {
            throw new Error(`Duplicate Tag(s): ${[...duplicateTags].map(tag => `${tag}`).join(', ')}`);
        }

        return rows.map(row => new Tag(row));
    },
};
