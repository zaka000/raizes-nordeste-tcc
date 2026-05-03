const { pool } = require('../../config/db');

const orderRepository = {
    createOrder: async (usuario_id, unidade_id, total, itens) => {
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            // 1. VERIFICAÇÃO DE ESTOQUE ANTES DE TUDO
            for (const item of itens) {
                const [estoqueAtual] = await conn.query(
                    'SELECT quantidade FROM estoque WHERE produto_id = ? AND unidade_id = ?',
                    [item.produto_id, unidade_id]
                );

                const qtdDisponivel = estoqueAtual.length > 0 ? estoqueAtual[0].quantidade : 0;

                if (qtdDisponivel < Number(item.quantidade)) {
                    throw new Error(`Estoque insuficiente para o produto ID ${item.produto_id}. Disponível: ${qtdDisponivel}`);
                }
            }

            // 2. Criar o pedido na tabela principal
            const [pedidoResult] = await conn.query(
                'INSERT INTO pedidos (usuario_id, unidade_id, total) VALUES (?, ?, ?)',
                [usuario_id, unidade_id, total]
            );
            const pedidoId = pedidoResult.insertId;

            // 3. Inserir os itens e baixar o estoque (USANDO SUBTRAÇÃO REAL)
            for (const item of itens) {
                // Registrar o item vendido
                await conn.query(
                    'INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario) VALUES (?, ?, ?, ?)',
                    [pedidoId, item.produto_id, item.quantidade, item.preco_unitario]
                );

                // Subtrair do estoque da unidade específica
                // O trecho "quantidade = quantidade - ?" garante que não zeramos o total[cite: 17]
                await conn.query(
                    'UPDATE estoque SET quantidade = quantidade - ? WHERE produto_id = ? AND unidade_id = ?',
                    [Number(item.quantidade), item.produto_id, unidade_id]
                );
            }

            await conn.commit();
            return { pedido_id: pedidoId };
        } catch (error) {
            await conn.rollback();
            console.error("🚨 Erro na transação de venda:", error.message);
            throw error;
        } finally {
            conn.release();
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