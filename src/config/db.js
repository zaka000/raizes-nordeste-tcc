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
        const connection = await pool.getConnection();
        console.log("✅ Conexão ativa para criação de tabelas");

        // Criando as tabelas na ordem correta (evita erro de chave estrangeira)
        await connection.query(`CREATE TABLE IF NOT EXISTS usuarios (id INT AUTO_INCREMENT PRIMARY KEY, nome VARCHAR(255), email VARCHAR(255) UNIQUE, senha VARCHAR(255))`);
        await connection.query(`CREATE TABLE IF NOT EXISTS produtos (id INT AUTO_INCREMENT PRIMARY KEY, nome VARCHAR(255), preco DECIMAL(10,2), categoria VARCHAR(100))`);
        await connection.query(`CREATE TABLE IF NOT EXISTS unidades (id INT AUTO_INCREMENT PRIMARY KEY, nome VARCHAR(255), cidade VARCHAR(100))`);
        await connection.query(`CREATE TABLE IF NOT EXISTS estoque (unidade_id INT, produto_id INT, quantidade INT DEFAULT 0, PRIMARY KEY (unidade_id, produto_id))`);
        await connection.query(`CREATE TABLE IF NOT EXISTS pedidos (id INT AUTO_INCREMENT PRIMARY KEY, usuario_id INT, unidade_id INT, total DECIMAL(10,2) DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
        await connection.query(`CREATE TABLE IF NOT EXISTS itens_pedido (id INT AUTO_INCREMENT PRIMARY KEY, pedido_id INT, produto_id INT, quantidade INT, preco_unitario DECIMAL(10,2))`);

        console.log("📂 Estrutura de tabelas completa!");
        connection.release();
    } catch (error) {
        console.error("❌ Erro ao inicializar tabelas:", error.message);
    }
};

module.exports = { pool, initDatabase };