/* eslint-disable camelcase */

import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up (pgm: MigrationBuilder): Promise<void> {
    pgm.sql('CREATE TABLE "session" (\n' +
    '  "sid" varchar NOT NULL COLLATE "default",\n' +
    '  "sess" json NOT NULL,\n' +
    '  "expire" timestamp(6) NOT NULL\n' +
    ')\n' +
    'WITH (OIDS=FALSE);\n' +
    '\n' +
    'ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;\n' +
    '\n' +
    'CREATE INDEX "IDX_session_expire" ON "session" ("expire");');
}

export async function down (pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable('session');
}
