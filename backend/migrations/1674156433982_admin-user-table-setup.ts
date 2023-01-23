/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up (pgm: MigrationBuilder): Promise<void> {
    pgm.createTable('admin_users', {
        id: {
            type: 'SERIAL',
            unique: true,
            primaryKey: true,
        },
        first_name: {
            type: 'TEXT',
            notNull: true,
        },
        last_name: {
            type: 'TEXT',
            notNull: true,
        },
        email: {
            type: 'TEXT',
            notNull: true,
        },
        username: {
            type: 'TEXT',
            notNull: true,
        },
        password: {
            type: 'TEXT',
            notNull: true,
        },
        last_login: {
            type: 'DATE',
        },
    });
}

export async function down (pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable('admin_users');
}
