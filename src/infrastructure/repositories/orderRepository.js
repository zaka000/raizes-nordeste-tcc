const { pool } = require('../../config/db'); // Mesma conexão do report

const orderRepository = {
    createOrder: async (usuario_id, unidade_id, total, itens) => {
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction(); // Inicia a transação de segurança

            // 1. Criar o pedido na tabela principal
            const [pedidoResult] = await conn.query(
                'INSERT INTO pedidos (usuario_id, unidade_id, total) VALUES (?, ?, ?)',
                [usuario_id, unidade_id, total]
            );
            const pedidoId = pedidoResult.insertId;

            // 2. Inserir os itens e atualizar o estoque
            for (const item of itens) {
                // Inserir item no pedido
                await conn.query(
                    'INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario) VALUES (?, ?, ?, ?)',
                    [pedidoId, item.produto_id, item.quantidade, item.preco_unitario]
                );

                // Descontar quantidade do estoque daquela unidade
                await conn.query(
                    'UPDATE estoque SET quantidade = quantidade - ? WHERE produto_id = ? AND unidade_id = ?',
                    [item.quantidade, item.produto_id, unidade_id]
                );
            }

            await conn.commit(); // Tudo deu certo, salva no banco!
            return { pedido_id: pedidoId };
        } catch (error) {
            await conn.rollback(); // Deu erro? Cancela tudo para não corromper dados
            throw error;
        } finally {
            conn.release(); // Libera a conexão
        }
    },

    findAll: async () => {
        const [rows] = await pool.query('SELECT * FROM pedidos ORDER BY data_pedido DESC');
        return rows;
    },

    findById: async (id) => {
        const conn = await pool.getConnection(); 
        try {
            const sql = `
                SELECT i.quantidade, i.preco_unitario, pr.nome as produto_nome
                FROM itens_pedido i
                JOIN produtos pr ON i.produto_id = pr.id
                WHERE i.pedido_id = ?`;
            const [results] = await conn.query(sql, [id]);
            return results;
        } finally {
            conn.release();
        }
    }
};

module.exports = orderRepository;