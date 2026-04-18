const stockRepository = require('../../infrastructure/repositories/stockRepository');

const stockController = {
    // ESSA É A FUNÇÃO QUE O SEU SITE ESTÁ CHAMANDO
    listAll: async (req, res) => {
        try {
            const stock = await stockRepository.findAllWithNames();
            res.json(stock);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    addStock: async (req, res) => {
        try {
            const { unidade_id, produto_id, quantidade } = req.body;
            await stockRepository.updateStock(unidade_id, produto_id, quantidade);
            res.status(200).json({ message: "Estoque atualizado com sucesso!" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getUnitStock: async (req, res) => {
        try {
            const { id } = req.params;
            const stock = await stockRepository.listByUnit(id);
            res.json(stock);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = stockController;