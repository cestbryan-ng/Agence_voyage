const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',      
  user: 'Jean_Roland',         
  password: 'Papasenegal0',           
  database: 'voyage'    
});

connection.connect((err) => {
  if (err) {
    console.error('Erreur de connexion :', err);
  } else {
    console.log('Connecté à MySQL');
  }
});

module.exports = connection;