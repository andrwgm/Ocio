/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

export const development = {
  client: 'pg',
  connection: {
    host: 'localhost',
    database: 'Ocio',
    user: 'postgres',
    password: 'root'
  }
}; 