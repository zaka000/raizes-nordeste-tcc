const { pool } = require('../../config/db');

const stockRepository = {
    // 1. Função de Listagem (Agora com LEFT JOIN para aparecer tudo)
    findAllWithNames: async () => {
        try {
            const [rows] = await pool.query(`
                SELECT 
                    p.id as produto_id, 
                    p.nome as produto_nome, 
                    p.preco, 
                    COALESCE(s.quantidade, 0) as quantidade
                FROM produtos p
                LEFT JOIN estoque s ON p.id = s.produto_id
            `);
            return rows;
        } catch (error) {
            console.error("Erro ao listar estoque:", error.message);
            return [];
        }
    }, // <-- Essa vírgula separa uma função da outra dentro do objeto

   
    updateStock: async (unidade_id, produto_id, quantidade) => {
        try {
            const [result] = await pool.query(
                'INSERT INTO estoque (unidade_id, produto_id, quantidade) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantidade = quantidade + ?', 
                [unidade_id, produto_id, quantidade, quantidade]
            );
            return result;
        } catch (error) {
            console.error("Erro ao atualizar estoque:", error.message);
            throw error;
        }
    } // <-- Aqui NÃO tem vírgula porque é a última função do objeto
};

module.exports = stockRepository;