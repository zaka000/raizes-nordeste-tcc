const mysql = require('mysql2/promise');
require('dotenv').config();

// Log para conferência no Render (Segurança: não logamos a senha)
console.log(`🔌 Tentando conectar em: ${process.env.DB_HOST}:${process.env.DB_PORT}`);

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT) || 10083,
    ssl: {
        rejectUnauthorized: false,
        minVersion: 'TLSv1.2'
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 60000, 
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000
    
});

const initDatabase = async () => {
    try {
        const connection = await pool.getConnection();
        console.log("✅ Conectado ao banco do Aiven!");

        // Tabelas essenciais
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

        // Garantir que exista pelo menos uma unidade e um usuário para testes
        await connection.query(`INSERT IGNORE INTO unidades (id, nome, cidade) VALUES (1, 'Matriz Nordeste', 'Recife')`);
        await connection.query(`INSERT IGNORE INTO usuarios (id, nome, email, senha) VALUES (1, 'Admin', 'admin@raizes.com', '123456')`);

        console.log("📂 Tabelas e dados iniciais verificados com sucesso!");
        connection.release();
    } catch (error) {
        console.error("❌ Erro fatal de conexão:", error.message);
        console.error("Dica: Verifique se o IP 0.0.0.0/0 está liberado no Aiven.");
    }
};

initDatabase();

module.exports = pool;