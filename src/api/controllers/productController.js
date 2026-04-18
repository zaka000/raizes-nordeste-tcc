
const productRepository = require('../repositories/productRepository');

const productController = {
    // Função para Listar
    findAll: async (req, res) => {
        try {
            const products = await productRepository.findAll();
            res.json(products);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Função para Criar (O erro deve estar aqui no nome!)
    create: async (req, res) => {
        try {
            const { nome, preco, categoria } = req.body;
            await productRepository.create(nome, preco, categoria);
            res.status(201).json({ message: "Produto criado com sucesso!" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Função para Deletar
   delete: async (req, res) => {
        try {
            const { id } = req.params; // Isso pega o ID da rota /products/:id
            const result = await productRepository.delete(id);
            
            if (result.affectedRows > 0) {
                return res.json({ message: "Produto excluído com sucesso!" });
            } else {
                return res.status(404).json({ message: "Produto não encontrado." });
            }
        } catch (error) {
            console.error("Erro no Controller (Delete):", error.message);
            return res.status(500).json({ message: "Erro ao excluir: verifique dependências no banco." });
        }
    }
};

module.exports = productController;