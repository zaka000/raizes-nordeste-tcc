const { pool } = require('../../config/db');

const stockRepository = {
    findAllWithNames: async () => {
        try {
            const [rows] = await pool.query(`
                SELECT 
                    p.id as produto_id, 
                    p.nome as produto_nome, 
                    p.preco, 
                    SUM(COALESCE(s.quantidade, 0)) as quantidade
                FROM produtos p
                LEFT JOIN estoque s ON p.id = s.produto_id
                GROUP BY p.id, p.nome, p.preco
            `);
            return rows;
        } catch (error) {
            console.error("Erro ao listar estoque:", error.message);
            return [];
        }
    },

  
    updateStock: async (unidade_id, produto_id, quantidade) => {
        try {
            
            const sql = `
                INSERT INTO estoque (unidade_id, produto_id, quantidade) 
                VALUES (?, ?, ?) 
                ON DUPLICATE KEY UPDATE quantidade = quantidade + VALUES(quantidade)
            `;
            const [result] = await pool.query(sql, [unidade_id, produto_id, quantidade]);
            return result;
        } catch (error) {
            console.error("Erro ao atualizar estoque:", error.message);
            throw error;
        }
    }
};

module.exports = stockRepository;