const sqlite3 = require('sqlite3').verbose();
const dotEnv= require ('dotenv');
const path = require ('path')
dotEnv.config();

const dbPath = path.join(__dirname,"database.db")

const db = new sqlite3.Database(process.env.DATABASE_URL, (err) => {
    if (err) {
      console.error('Error connecting to SQLite database:', err.message);
    } else {
      console.log('Connected to the SQLite database.');
    }
  });


module.exports=db;
