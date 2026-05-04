const mysql = require('mysql2/promise');
require('dotenv').config();

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

        await connection.query(`
            CREATE TABLE IF NOT EXISTS produtos (
                id INT AUTO_INCREMENT PRIMARY KEY, 
                nome VARCHAR(255) NOT NULL, 
                preco DECIMAL(10,2) NOT NULL, 
                categoria VARCHAR(100)
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS unidades (
                id INT AUTO_INCREMENT PRIMARY KEY, 
                nome VARCHAR(255) NOT NULL, 
                cidade VARCHAR(255)
            )
        `);

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

        await connection.query(`
            CREATE TABLE IF NOT EXISTS pedidos (
                id INT AUTO_INCREMENT PRIMARY KEY, 
                total DECIMAL(10,2) NOT NULL, 
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS estoque (
            id INT AUTO_INCREMENT PRIMARY KEY,
            unidade_id INT,
            produto_id INT,
            quantidade INT DEFAULT 0,
            UNIQUE KEY unique_estoque (unidade_id, produto_id), -- ISSO IMPEDE A REPETIÇÃO
            FOREIGN KEY (unidade_id) REFERENCES unidades(id) ON DELETE CASCADE,
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