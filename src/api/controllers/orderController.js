const orderRepository = require('../../infrastructure/repositories/orderRepository');


const orderController = {
    create: async (req, res) => {
        try {
            const { usuario_id, unidade_id, total, itens } = req.body;
            const result = await orderRepository.createOrder(usuario_id, unidade_id, total, itens);
            res.status(201).json({ message: "Pedido realizado com sucesso!", pedido_id: result.pedido_id });
        } catch (error) {
            res.status(500).json({ message: "Erro ao processar pedido: " + error.message });
        }
    },

    listAll: async (req, res) => {
        try {
            const orders = await orderRepository.findAll();
            res.json(orders);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getDetails: async (req, res) => {
        try {
            const { id } = req.params;
            const details = await orderRepository.findById(id);
            res.json(details);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};


module.exports = orderController;