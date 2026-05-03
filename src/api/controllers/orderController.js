const orderRepository = require('../../infrastructure/repositories/orderRepository');

const orderController = {
    create: async (req, res) => {
        try {
            // DETETIVE: Mostra no terminal o que o seu site está tentando comprar
            console.log("🛒 [Nova Venda] Dados recebidos do Frontend:", JSON.stringify(req.body, null, 2));

            const { usuario_id, unidade_id, total, itens } = req.body;

            // Validação de segurança
            if (!usuario_id || !unidade_id || !itens || itens.length === 0) {
                console.log("❌ Erro: O Frontend mandou dados incompletos.");
                return res.status(400).json({ message: "Dados incompletos. Verifique se o usuário está logado e se há itens no carrinho." });
            }

            const result = await orderRepository.createOrder(usuario_id, unidade_id, total, itens);
            console.log("✅ Venda concluída com sucesso! ID do Pedido:", result.pedido_id);
            res.status(201).json({ message: "Pedido realizado com sucesso!", pedido_id: result.pedido_id });
        } catch (error) {
            console.error("🚨 Erro ao tentar processar a venda no banco:", error);
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