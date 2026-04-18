const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuração da conexão com SSL obrigatório para o Aiven
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 10083,
    ssl: {
        rejectUnauthorized: false // Essencial para o Aiven funcionar no Render
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Script para criar as tabelas automaticamente se elas não existirem
const initDatabase = async () => {
    try {
        const connection = await pool.getConnection();
        console.log("✅ Conectado ao banco do Aiven!");

        await connection.query(`CREATE TABLE IF NOT EXISTS usuarios (id INT AUTO_INCREMENT PRIMARY KEY, nome VARCHAR(255), email VARCHAR(255) UNIQUE, senha VARCHAR(255))`);
        await connection.query(`CREATE TABLE IF NOT EXISTS produtos (id INT AUTO_INCREMENT PRIMARY KEY, nome VARCHAR(255), preco DECIMAL(10,2), categoria VARCHAR(100))`);
        await connection.query(`CREATE TABLE IF NOT EXISTS unidades (id INT AUTO_INCREMENT PRIMARY KEY, nome VARCHAR(255), cidade VARCHAR(100))`);
        await connection.query(`CREATE TABLE IF NOT EXISTS estoque (unidade_id INT, produto_id INT, quantidade INT DEFAULT 0, PRIMARY KEY (unidade_id, produto_id))`);
        await connection.query(`CREATE TABLE IF NOT EXISTS pedidos (id INT AUTO_INCREMENT PRIMARY KEY, usuario_id INT, unidade_id INT, total DECIMAL(10,2))`);
        await connection.query(`CREATE TABLE IF NOT EXISTS itens_pedido (id INT AUTO_INCREMENT PRIMARY KEY, pedido_id INT, produto_id INT, quantidade INT, preco_unitario DECIMAL(10,2))`);

        console.log("📂 Tabelas verificadas/criadas com sucesso!");
        connection.release();
    } catch (error) {
        console.error("❌ Erro ao conectar ou criar tabelas:", error.message);
    }
};

initDatabase();

module.exports = pool;