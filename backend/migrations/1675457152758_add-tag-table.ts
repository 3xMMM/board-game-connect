/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up (pgm: MigrationBuilder): Promise<void> {
    pgm.createTable('tags', {
        name: {
            type: 'TEXT',
            notNull: true,
            primaryKey: true,
            check: 'name = lower(name)',
        },
    });
}

export async function down (pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable('tags');
}
