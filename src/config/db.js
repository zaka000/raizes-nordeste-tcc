const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: 'mysql-raizes-nordeste-raizes-nordeste-tcc.d.aivencloud.com',
    user: 'avnadmin',
    password: process.env.DB_PASSWORD, // Usa a senha separada que você criou
    database: 'defaultdb',
    port: 10083,
    ssl: {
        rejectUnauthorized: false
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const initDatabase = async () => {
    try {
        const connection = await pool.getConnection();
        console.log("✅ CONEXÃO ESTABELECIDA COM SUCESSO!");
        
        // Criar tabelas
        await connection.query(`CREATE TABLE IF NOT EXISTS produtos (id INT AUTO_INCREMENT PRIMARY KEY, nome VARCHAR(255), preco DECIMAL(10,2), categoria VARCHAR(100))`);
        await connection.query(`CREATE TABLE IF NOT EXISTS pedidos (id INT AUTO_INCREMENT PRIMARY KEY, total DECIMAL(10,2), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
        
        connection.release();
    } catch (error) {
        console.error("❌ ERRO DE ACESSO:", error.message);
    }
};

module.exports = { pool, initDatabase };