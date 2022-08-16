"use strict";
// Update with your config settings.
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
exports.default = {
    development: {
        client: 'mysql',
        connection: {
            database: 'lendsqr',
            user: 'steve',
            password: '123456'
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations'
        }
    }
};
