const db = require('../database/connection');

const stockRepository = {
    
    findAllWithNames: async () => {
        const [rows] = await db.query(`
            SELECT 
                p.nome as produto_nome, 
                e.quantidade, 
                p.preco,
                e.produto_id
            FROM estoque e
            JOIN produtos p ON e.produto_id = p.id
        `);
        return rows;
    },

    updateStock: async (unidade_id, produto_id, quantidade) => {
        
        const sql = `
            INSERT INTO estoque (unidade_id, produto_id, quantidade) 
            VALUES (?, ?, ?) 
            ON DUPLICATE KEY UPDATE quantidade = quantidade + VALUES(quantidade)`;
        await db.query(sql, [unidade_id, produto_id, quantidade]);
    },

    listByUnit: async (unidade_id) => {
        const [rows] = await db.query(
            'SELECT p.nome, e.quantidade FROM estoque e JOIN produtos p ON e.produto_id = p.id WHERE e.unidade_id = ?',
            [unidade_id]
        );
        return rows;
    }
};

module.exports = stockRepository;