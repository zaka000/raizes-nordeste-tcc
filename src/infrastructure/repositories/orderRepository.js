findById: async (id) => {
        const conn = await connection.getConnection(); 
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