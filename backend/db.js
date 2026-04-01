const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'admin1234',
  database: process.env.DB_NAME || 'eyana_library_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Check connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err.message);
  } else {
    console.log('Connected to the MySQL database.');
    connection.release();
  }
});

module.exports = pool;
