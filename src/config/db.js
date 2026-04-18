const mysql = require('mysql2/promise');
require('dotenv').config();

// Criamos o pool de forma simples. O SSL já vai vir na DATABASE_URL do Render.
const pool = mysql.createPool(process.env.DATABASE_URL);

// Função para inicializar as tabelas (será chamada pelo server.js depois)
const initDatabase = async () => {
    try {
        console.log("⏳ Testando conexão com o Aiven...");
        const connection = await pool.getConnection();
        console.log("✅ CONECTADO AO BANCO COM SUCESSO!");

        await connection.query(`CREATE TABLE IF NOT EXISTS produtos (id INT AUTO_INCREMENT PRIMARY KEY, nome VARCHAR(255), preco DECIMAL(10,2), categoria VARCHAR(100))`);
        await connection.query(`CREATE TABLE IF NOT EXISTS unidades (id INT AUTO_INCREMENT PRIMARY KEY, nome VARCHAR(255), cidade VARCHAR(100))`);
        await connection.query(`CREATE TABLE IF NOT EXISTS estoque (unidade_id INT, produto_id INT, quantidade INT DEFAULT 0, PRIMARY KEY (unidade_id, produto_id))`);
        await connection.query(`CREATE TABLE IF NOT EXISTS pedidos (id INT AUTO_INCREMENT PRIMARY KEY, usuario_id INT, unidade_id INT, total DECIMAL(10,2), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
        await connection.query(`CREATE TABLE IF NOT EXISTS itens_pedido (id INT AUTO_INCREMENT PRIMARY KEY, pedido_id INT, produto_id INT, quantidade INT, preco_unitario DECIMAL(10,2))`);

        console.log("📂 Tabelas verificadas!");
        connection.release();
    } catch (error) {
        console.error("❌ AVISO: Servidor rodando, mas banco ainda não conectou:", error.message);
    }
};

// Exportamos o pool e a função de inicialização
module.exports = { pool, initDatabase };