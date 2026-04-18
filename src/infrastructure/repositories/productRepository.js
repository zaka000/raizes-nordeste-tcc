// Adicionamos as chaves { pool } para pegar apenas a conexão do banco
const { pool } = require('../../config/db');

const productRepository = {
    create: async (nome, preco, categoria) => {
        try {
            // Trocamos 'db.query' por 'pool.query'
            const [result] = await pool.query(
                'INSERT INTO produtos (nome, preco, categoria) VALUES (?, ?, ?)', 
                [nome, preco, categoria]
            );
            return result;
        } catch (error) {
            console.error("Erro ao inserir produto:", error.message);
            throw error; // Lança o erro para o controller tratar
        }
    },
    findAll: async () => {
        try {
            // Trocamos 'db.query' por 'pool.query'
            const [rows] = await pool.query('SELECT * FROM produtos');
            return rows;
        } catch (error) {
            console.error("Erro ao buscar produtos:", error.message);
            return []; // Retorna lista vazia para não quebrar o frontend
        }
    }
};

module.exports = productRepository;