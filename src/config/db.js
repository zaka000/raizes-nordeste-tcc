const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    uri: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    },
    // Aumentando o tempo de espera ao máximo para o Aiven responder
    connectTimeout: 60000,
    waitForConnections: true,
    connectionLimit: 10
});

const initDatabase = async () => {
    try {
        console.log("⏳ Tentando conexão master com o Aiven...");
        const connection = await pool.getConnection();
        console.log("✅ CONECTADO!");

        await connection.query(`CREATE TABLE IF NOT EXISTS produtos (id INT AUTO_INCREMENT PRIMARY KEY, nome VARCHAR(255), preco DECIMAL(10,2), categoria VARCHAR(100))`);
        // Adicione as outras tabelas aqui depois que o "CONECTADO" aparecer.

        connection.release();
    } catch (error) {
        console.error("❌ ERRO ATUAL:", error.message);
        console.log("Dica: Verifique se o IP 0.0.0.0/0 está no Aiven sem erros vermelhos.");
    }
};

initDatabase();
module.exports = pool;