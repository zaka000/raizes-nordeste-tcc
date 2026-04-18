const { pool } = require('../../config/db'); // Ajuste na importação para usar o pool

const reportRepository = {
    getDashboardData: async () => {
        try {
            // Usamos COALESCE para garantir que se o banco estiver vazio, retorne 0 em vez de NULL
            const [vendasResult] = await pool.query('SELECT COALESCE(SUM(total), 0) as faturamento FROM pedidos');
            const [pedidosResult] = await pool.query('SELECT COUNT(*) as qtd_pedidos FROM pedidos');

            return { 
                faturamento: vendasResult[0].faturamento, 
                qtd_pedidos: pedidosResult[0].qtd_pedidos 
            };
        } catch (error) {
            console.error("Erro no SQL do Repositório:", error.message);
            // Se as tabelas ainda não existirem, ele retorna 0 para o site não travar
            return { faturamento: 0, qtd_pedidos: 0 };
        }
    }
};

module.exports = reportRepository;