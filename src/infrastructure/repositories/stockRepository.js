findAllWithNames: async () => {
    try {
        // Mudamos para buscar da tabela de PRODUTOS primeiro. 
        // Se não tiver estoque, ele traz "0" em vez de sumir com o produto.
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
},