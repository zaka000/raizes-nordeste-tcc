const mysql = require('mysql2/promise');
require('dotenv').config();

// Log para conferência no Render
if (!process.env.DB_PASSWORD) {
    console.error("❌ ERRO: A variável DB_PASSWORD não foi encontrada!");
}

const pool = mysql.createPool({
    host: 'mysql-raizes-nordeste-raizes-nordeste-tcc.d.aivencloud.com',
    user: 'avnadmin',
    password: process.env.DB_PASSWORD,
    database: 'defaultdb',
    port: 10083,
    ssl: {
        rejectUnauthorized: false
    },
    // Adicionamos estas configurações para maior estabilidade no método Native
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

const initDatabase = async () => {
    try {
        const connection = await pool.getConnection();
        console.log("✅ AGORA FOI! CONEXÃO ESTABELECIDA COM SUCESSO!");
        
        // Criar tabelas caso não existam
        await connection.query(`
            CREATE TABLE IF NOT EXISTS produtos (
                id INT AUTO_INCREMENT PRIMARY KEY, 
                nome VARCHAR(255), 
                preco DECIMAL(10,2), 
                categoria VARCHAR(100)
            )
        `);
        
        await connection.query(`
            CREATE TABLE IF NOT EXISTS pedidos (
                id INT AUTO_INCREMENT PRIMARY KEY, 
                total DECIMAL(10,2), 
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        connection.release();
    } catch (error) {
        console.error("❌ ERRO NO BANCO DE DADOS:", error.message);
    }
};

module.exports = { pool, initDatabase };