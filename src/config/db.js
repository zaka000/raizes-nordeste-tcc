const mysql = require('mysql2/promise');
require('dotenv').config();

// Agora usamos apenas a URL completa, que é mais estável
const pool = mysql.createPool(process.env.DATABASE_URL + "?ssl-mode=REQUIRED");

const initDatabase = async () => {
    try {
        // Tentativa de conexão
        const connection = await pool.getConnection();
        console.log("✅ CONEXÃO ESTABELECIDA VIA URI COM SUCESSO!");

        // Tabelas
        const queries = [
            `CREATE TABLE IF NOT EXISTS usuarios (id INT AUTO_INCREMENT PRIMARY KEY, nome VARCHAR(255), email VARCHAR(255) UNIQUE, senha VARCHAR(255))`,
            `CREATE TABLE IF NOT EXISTS produtos (id INT AUTO_INCREMENT PRIMARY KEY, nome VARCHAR(255), preco DECIMAL(10,2), categoria VARCHAR(100))`,
            `CREATE TABLE IF NOT EXISTS unidades (id INT AUTO_INCREMENT PRIMARY KEY, nome VARCHAR(255), cidade VARCHAR(100))`,
            `CREATE TABLE IF NOT EXISTS estoque (unidade_id INT, produto_id INT, quantidade INT DEFAULT 0, PRIMARY KEY (unidade_id, produto_id))`,
            `CREATE TABLE IF NOT EXISTS pedidos (id INT AUTO_INCREMENT PRIMARY KEY, usuario_id INT, unidade_id INT, total DECIMAL(10,2), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`,
            `CREATE TABLE IF NOT EXISTS itens_pedido (id INT AUTO_INCREMENT PRIMARY KEY, pedido_id INT, produto_id INT, quantidade INT, preco_unitario DECIMAL(10,2))`
        ];

        for (let query of queries) {
            await connection.query(query);
        }

        console.log("📂 Estrutura do banco pronta!");
        connection.release();
    } catch (error) {
        console.error("❌ Erro de conexão via URI:", error.message);
    }
};

initDatabase();
module.exports = pool;