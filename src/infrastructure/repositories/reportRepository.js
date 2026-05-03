const { pool } = require('../../config/db'); 

const reportRepository = {
    getDashboardData: async () => {
        try {
            const [vendasResult] = await pool.query('SELECT COALESCE(SUM(total), 0) as faturamento FROM pedidos');
            const [pedidosResult] = await pool.query('SELECT COUNT(*) as qtd_pedidos FROM pedidos');

            return { 
                faturamento: vendasResult[0].faturamento, 
                qtd_pedidos: pedidosResult[0].qtd_pedidos 
            };
        } catch (error) {
            console.error("Erro no SQL do Repositório:", error.message);
            return { faturamento: 0, qtd_pedidos: 0 };
        }
    }
};

module.exports = reportRepository;