const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'db',
  user: 'root',
  password: 'root',
  database: 'dbProj'
  
});

// Connect to the database
connection.connect(function(err) {
  if (err) throw err;
  console.log('Connected to the MySQL database');
});

module.exports = connection;
