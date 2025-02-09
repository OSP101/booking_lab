const mysql = require('mysql2');

export const mysqlPool = mysql.createPool({
  host: process.env.MYSQL_HOST_CLOUD,
  user: process.env.MYSQL_USER_CLOUD,
  password: process.env.MYSQL_PASSWORD_CLOUD,
  database: process.env.MYSQL_DATABASE_CLOUD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
