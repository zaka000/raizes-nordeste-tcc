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

                if (qtdDisponivel < item.quantidade) {
                    throw new Error(`Estoque insuficiente para o produto ID ${item.produto_id}. Disponível: ${qtdDisponivel}`);
                }
            }

            // 2. Criar o pedido
            const [pedidoResult] = await conn.query(
                'INSERT INTO pedidos (usuario_id, unidade_id, total) VALUES (?, ?, ?)',
                [usuario_id, unidade_id, total]
            );
            const pedidoId = pedidoResult.insertId;

            // 3. Inserir itens e baixar estoque
            for (const item of itens) {
                await conn.query(
                    'INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario) VALUES (?, ?, ?, ?)',
                    [pedidoId, item.produto_id, item.quantidade, item.preco_unitario]
                );

                await conn.query(
                    'UPDATE estoque SET quantidade = quantidade - ? WHERE produto_id = ? AND unidade_id = ?',
                    [item.quantidade, item.produto_id, unidade_id]
                );
            }

            await conn.commit();
            return { pedido_id: pedidoId };
        } catch (error) {
            await conn.rollback();
            throw error; // Esse erro será pego pelo Controller e enviado ao site
        } finally {
            conn.release();
        }
    },
    // ... mantenha as outras funções (findAll, findById) como estão
};

module.exports = orderRepository;