// * Esse arquivo se conecta co o banco de dados

const { Pool } = require('pg'); // 1 - importação do Pool da biblioteca pg
require('dotenv').config();      // 2 - necessidade do arquivo .env

const pool = new Pool({          // 3 - Cria a instância do pool usando as credenciais
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

module.exports = pool;           // 4 - export o pool para ser usado em outros arquivos