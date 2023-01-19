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
    firstName: {
      type: 'TEXT',
      notNull: true,
    },
    lastName: {
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
    lastLogin: {
      type: 'DATE',
    },
  });
}

export async function down (pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('admin_users');
}
