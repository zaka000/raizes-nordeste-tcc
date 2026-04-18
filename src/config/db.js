const mysql = require('mysql2/promise');
require('dotenv').config();

// Criamos o pool com configurações explícitas de SSL
const pool = mysql.createPool({
    uri: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Essencial para aceitar o certificado do Aiven
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 20000 // 20 segundos para tentar conectar
});

const initDatabase = async () => {
    try {
        console.log("⏳ Tentando conexão final com Aiven...");
        const connection = await pool.getConnection();
        console.log("✅ BANCO DE DADOS CONECTADO!");

        // Verifica se a tabela básica existe
        await connection.query(`CREATE TABLE IF NOT EXISTS produtos (id INT AUTO_INCREMENT PRIMARY KEY, nome VARCHAR(255), preco DECIMAL(10,2), categoria VARCHAR(100))`);
        
        connection.release();
    } catch (error) {
        console.error("❌ ERRO NA CONEXÃO:", error.message);
        console.log("DICA: Verifique se sua senha no DATABASE_URL está correta.");
    }
};

module.exports = { pool, initDatabase };