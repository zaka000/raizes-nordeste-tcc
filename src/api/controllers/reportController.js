const reportRepository = require('../../infrastructure/repositories/reportRepository');

const reportController = {
    getGeneralDashboard: async (req, res) => {
        try {
            const data = await reportRepository.getDashboardData();
            res.json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erro ao gerar relatório" });
        }
    }
};

module.exports = reportController;