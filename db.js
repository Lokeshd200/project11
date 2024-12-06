const sqlite3 = require('better-sqlite3');
const dotEnv= require ('dotenv');
const path = require ('path')
dotEnv.config();

const dbPath = path.join(__dirname,"database.db")

const db =sqlite3(dbPath);

console.log('Connected to the SQLite database.');


module.exports=db;
