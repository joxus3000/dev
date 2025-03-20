require("dotenv").config();
const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "nagamed-database-kiwikun0-8384.e.aivencloud.com",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "avnadmin",
  password: process.env.DB_PASSWORD || "AVNS_KtzNoq33R63CEyDpgv8",
  database: process.env.DB_NAME || "ClinicDB",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


module.exports = pool.promise();

