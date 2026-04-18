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
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

const initDatabase = async () => {
    try {
        const connection = await pool.getConnection();
        console.log("🚀 CONEXÃO ESTABELECIDA E CRIANDO TABELAS...");

        // 1. Tabela de Produtos
        await connection.query(`
            CREATE TABLE IF NOT EXISTS produtos (
                id INT AUTO_INCREMENT PRIMARY KEY, 
                nome VARCHAR(255) NOT NULL, 
                preco DECIMAL(10,2) NOT NULL, 
                categoria VARCHAR(100)
            )
        `);

        // 2. Tabela de Unidades (Essencial para o estoque aparecer!)
        await connection.query(`
            CREATE TABLE IF NOT EXISTS unidades (
                id INT AUTO_INCREMENT PRIMARY KEY, 
                nome VARCHAR(255) NOT NULL, 
                cidade VARCHAR(255)
            )
        `);

        // 3. Tabela de Estoque (Com chaves estrangeiras)
        await connection.query(`
            CREATE TABLE IF NOT EXISTS estoque (
                id INT AUTO_INCREMENT PRIMARY KEY,
                unidade_id INT,
                produto_id INT,
                quantidade INT DEFAULT 0,
                FOREIGN KEY (unidade_id) REFERENCES unidades(id) ON DELETE CASCADE,
                FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE
            )
        `);

        // 4. Tabela de Pedidos
        await connection.query(`
            CREATE TABLE IF NOT EXISTS pedidos (
                id INT AUTO_INCREMENT PRIMARY KEY, 
                total DECIMAL(10,2) NOT NULL, 
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 5. Tabela de Itens do Pedido (Para detalhamento da compra)
        await connection.query(`
            CREATE TABLE IF NOT EXISTS itens_pedido (
                id INT AUTO_INCREMENT PRIMARY KEY,
                pedido_id INT,
                produto_id INT,
                quantidade INT,
                preco_unitario DECIMAL(10,2),
                FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
                FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE
            )
        `);

        console.log("✅ TODAS AS TABELAS ESTÃO PRONTAS!");
        connection.release();
    } catch (error) {
        console.error("❌ ERRO AO INICIALIZAR BANCO:", error.message);
    }
};

module.exports = { pool, initDatabase };