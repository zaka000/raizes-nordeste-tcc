const db = require('../database/connection'); 

const reportRepository = {
    getDashboardData: async () => {
        try {
            // Se o seu db já for "promisified", usamos direto o query
            const [revenue] = await db.query('SELECT SUM(total) as faturamento_total FROM pedidos');
            const [orders] = await db.query('SELECT COUNT(*) as total_pedidos FROM pedidos');
            
            return {
                faturamento: revenue[0].faturamento_total || 0,
                qtd_pedidos: orders[0].total_pedidos || 0
            };
        } catch (error) {
            console.error("ERRO NO BANCO DE DADOS:", error.message);
            throw error; 
        }
    }
};

module.exports = reportRepository;