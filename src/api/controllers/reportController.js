const reportRepository = require('../../infrastructure/repositories/reportRepository');

const reportController = {
    getGeneralDashboard: async (req, res) => {
        try {
            const data = await reportRepository.getDashboardData();
            
            // Se o repositório retornar null ou undefined por falta de dados
            if (!data) {
                return res.json({ faturamento: 0, qtd_pedidos: 0 });
            }

            res.json(data);
        } catch (error) {
            console.error("🚨 Erro no Controller de Relatório:", error);
            
            // Retornamos um objeto zerado em vez de erro 500 para o Dashboard não ficar "Offline"
            // Mas enviamos o erro no console para você conseguir debugar no Render
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