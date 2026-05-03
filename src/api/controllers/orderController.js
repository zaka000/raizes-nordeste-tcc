const orderRepository = require('../../infrastructure/repositories/orderRepository');

const orderController = {
    create: async (req, res) => {
        try {
            // Esse log vai aparecer no seu terminal do Render
            console.log("🛒 Recebido pedido do Frontend:", req.body);

            const { usuario_id, unidade_id, total, itens } = req.body;

            // Verificação básica para não deixar o banco travar
            if (!usuario_id || !unidade_id || !itens) {
                console.log("⚠️ Dados incompletos vindos do site");
                return res.status(400).json({ message: "Por favor, verifique se você está logado e selecionou uma unidade." });
            }

            const result = await orderRepository.createOrder(usuario_id, unidade_id, total, itens);
            
            console.log("✅ Venda salva com sucesso!");
            return res.status(201).json({ 
                message: "Pedido realizado com sucesso!", 
                pedido_id: result.pedido_id 
            });

        } catch (error) {
            // Se o estoque for insuficiente, o erro do repositório vai cair aqui
            console.error("🚨 Erro ao processar venda:", error.message);
            return res.status(500).json({ 
                message: "Erro na venda: " + error.message 
            });
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