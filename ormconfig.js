module.exports = {
  type: process.env.DB_TYPE,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  entities: ['dist/**/*.entity.js'],
  synchronize: false, // should be off to protect prod database.
  // DO NOT turn on sync option NEVER!
};
