const reportRepository = require('../../infrastructure/repositories/reportRepository');

const reportController = {
    getGeneralDashboard: async (req, res) => {
        try {
            const data = await reportRepository.getDashboardData();
            
            // DETETIVE: Mostra no terminal o que o banco respondeu pro dashboard
            console.log("📊 [Dashboard] Dados recebidos do banco:", data);
            
            if (!data) {
                return res.json({ faturamento: 0, qtd_pedidos: 0 });
            }

            // Garante que os números vão para o frontend como números reais, não textos
            res.json({
                faturamento: Number(data.faturamento) || 0,
                qtd_pedidos: Number(data.qtd_pedidos) || 0
            });
        } catch (error) {
            console.error("🚨 Erro no Controller de Relatório:", error);
            
            res.status(200).json({ 
                faturamento: 0, 
                qtd_pedidos: 0, 
                aviso: "Banco de dados vazio ou tabelas não criadas",
                detalhe_erro: error.message 
            });
        }
    }
};

module.exports = reportController;