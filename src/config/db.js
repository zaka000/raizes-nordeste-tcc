const mysql = require('mysql2/promise');
require('dotenv').config();

// No Aiven, a conexão PRECISA de SSL. 
// Passar a URL direto no createPool é o jeito mais estável.
const pool = mysql.createPool(process.env.DATABASE_URL);

const initDatabase = async () => {
    try {
        console.log("⏳ Iniciando tentativa de conexão com Aiven...");
        
        // Pegando uma conexão do pool para testar
        const connection = await pool.getConnection();
        console.log("✅ CONECTADO AO BANCO COM SUCESSO!");

        // Criando as tabelas essenciais
        await connection.query(`CREATE TABLE IF NOT EXISTS produtos (id INT AUTO_INCREMENT PRIMARY KEY, nome VARCHAR(255), preco DECIMAL(10,2), categoria VARCHAR(100))`);
        await connection.query(`CREATE TABLE IF NOT EXISTS unidades (id INT AUTO_INCREMENT PRIMARY KEY, nome VARCHAR(255), cidade VARCHAR(100))`);
        await connection.query(`CREATE TABLE IF NOT EXISTS estoque (unidade_id INT, produto_id INT, quantidade INT DEFAULT 0, PRIMARY KEY (unidade_id, produto_id))`);
        await connection.query(`CREATE TABLE IF NOT EXISTS pedidos (id INT AUTO_INCREMENT PRIMARY KEY, usuario_id INT, unidade_id INT, total DECIMAL(10,2), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
        await connection.query(`CREATE TABLE IF NOT EXISTS itens_pedido (id INT AUTO_INCREMENT PRIMARY KEY, pedido_id INT, produto_id INT, quantidade INT, preco_unitario DECIMAL(10,2))`);

        console.log("📂 Todas as tabelas foram verificadas!");
        
        connection.release();
    } catch (error) {
        console.error("❌ ERRO NO BANCO:", error.message);
        console.log("Verifique se a DATABASE_URL no Render termina com ?ssl-mode=REQUIRED");
    }
};

initDatabase();
module.exports = pool;