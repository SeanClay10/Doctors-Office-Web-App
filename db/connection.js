// Authors: Sean Clayton, Ivan Wong, Alex Loomis
// Module Imports & Config
const mysql = require("mysql2");
require("dotenv").config();

// Database Connection Setup
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect to Database
connection.connect((err) => {
  if (err) console.log(err);
  else console.log("Connected to the database.");
});

// Export Connection
module.exports = connection;
