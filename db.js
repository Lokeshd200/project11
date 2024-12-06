const sqlite3 = require('sqlite3')
const dotEnv= require ('dotenv');
const path = require ('path')

const dbPath = path.join(__dirname,"database.db")

const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
      console.error('Error connecting to SQLite database:', err.message);
    } else {
      console.log('Connected to the SQLite database.');
    }
  });


module.exports=db;