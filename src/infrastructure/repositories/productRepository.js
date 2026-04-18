const db = require('../database/connection');

const productRepository = {
    findAll: async () => {
        const [rows] = await db.query('SELECT * FROM produtos');
        return rows;
    },
    
    create: async (nome, preco, categoria) => {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            // 1. Cria o produto
            const [result] = await conn.query(
                'INSERT INTO produtos (nome, preco, categoria) VALUES (?, ?, ?)',
                [nome, preco, categoria]
            );
            const produto_id = result.insertId;

            // 2. Cria a entrada automática no estoque (Unidade 1, Qtd 0)
            await conn.query(
                'INSERT INTO estoque (unidade_id, produto_id, quantidade) VALUES (?, ?, ?)',
                [1, produto_id, 0] 
            );

            await conn.commit();
            return result;
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    }
};

module.exports = productRepository;