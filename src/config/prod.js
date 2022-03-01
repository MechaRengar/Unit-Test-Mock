export default {
  PORT: process.env.PORT,
  KNEX_CONFIG: {
    client: process.env.DB_CLIENT,
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    },
    pool: {
      min: 0,
      max: 10,
    },
  },
  JWT_SECRET: process.env.JWT_SECRET,
  BCRYPT_SALT: process.env.BCRYPT_SALT,
  ROLE: {
    ADMIN: 1,
    MANAGER: 2,
    STAFF: 3,
    CUSTOMER: 4,
  },
};
