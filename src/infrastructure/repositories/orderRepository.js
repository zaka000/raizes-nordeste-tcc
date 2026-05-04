const { pool } = require('../../config/db');

const orderRepository = {
    createOrder: async (usuario_id, unidade_id, total, itens) => {
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            for (const item of itens) {
                const [estoqueAtual] = await conn.query(
                    'SELECT quantidade FROM estoque WHERE produto_id = ? AND unidade_id = ?',
                    [item.produto_id, unidade_id]
                );
                const qtdDisponivel = estoqueAtual.length > 0 ? estoqueAtual[0].quantidade : 0;
                if (qtdDisponivel < Number(item.quantidade)) {
                    throw new Error(`Estoque insuficiente para o produto ID ${item.produto_id}.`);
                }
            }

            const [pedidoResult] = await conn.query(
                'INSERT INTO pedidos (usuario_id, unidade_id, total) VALUES (?, ?, ?)',
                [usuario_id, unidade_id, total]
            );
            const pedidoId = pedidoResult.insertId;

            for (const item of itens) {
                await conn.query(
                    'INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario) VALUES (?, ?, ?, ?)',
                    [pedidoId, item.produto_id, item.quantidade, item.preco_unitario]
                );
                await conn.query(
                    'UPDATE estoque SET quantidade = quantidade - ? WHERE produto_id = ? AND unidade_id = ?',
                    [Number(item.quantidade), item.produto_id, unidade_id]
                );
            }

            await conn.commit();
            return { pedido_id: pedidoId };
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },

   findAll: async () => {
    try {
        
        const [rows] = await pool.query('SELECT id, total, unidade_id, usuario_id, data_pedido AS created_at FROM pedidos ORDER BY id DESC'); 
        return rows;
    } catch (error) {
        console.error("Erro no SQL do findAll:", error);
        throw error;
    }
},
    findById: async (id) => {
        const sql = `
            SELECT 
                i.quantidade, 
                i.preco_unitario, 
                p.nome as produto_nome
            FROM itens_pedido i
            JOIN produtos p ON i.produto_id = p.id
            WHERE i.pedido_id = ?`;
        const [results] = await pool.query(sql, [id]);
        return results;
    }
};

module.exports = orderRepository;