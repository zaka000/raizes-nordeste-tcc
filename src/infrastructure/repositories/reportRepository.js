const db = require('../../config/db');

const reportRepository = {
    getDashboardData: async () => {
        const [totalVendas] = await db.query('SELECT SUM(total) as vendas FROM pedidos');
        const [totalProdutos] = await db.query('SELECT COUNT(*) as produtos FROM produtos');
        return { totalVendas: totalVendas[0].vendas, totalProdutos: totalProdutos[0].produtos };
    }
};
module.exports = reportRepository;