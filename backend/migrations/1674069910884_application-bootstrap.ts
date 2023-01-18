/* eslint-disable camelcase */

import { MigrationBuilder } from 'node-pg-migrate';

exports.shorthands = undefined;

exports.up = (pgm: MigrationBuilder) => {
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
};

exports.down = (pgm: MigrationBuilder) => {
  pgm.dropTable('session');
};
