
// Verifique se o caminho abaixo bate com a sua estrutura de pastas
const productRepository = require('../repositories/productRepository');

const productController = {
    // Listar todos os produtos
    findAll: async (req, res) => {
        try {
            const products = await productRepository.findAll();
            res.json(products);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Criar um novo produto
    create: async (req, res) => {
        try {
            const { nome, preco, categoria } = req.body;
            if (!nome || !preco) {
                return res.status(400).json({ message: "Nome e preço são obrigatórios." });
            }
            await productRepository.create(nome, preco, categoria);
            res.status(201).json({ message: "Produto criado com sucesso!" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Excluir um produto
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            
            // Tenta excluir
            const result = await productRepository.delete(id);
            
            if (result && result.affectedRows > 0) {
                res.json({ message: "Produto removido com sucesso!" });
            } else {
                res.status(404).json({ message: "Produto não encontrado." });
            }
        } catch (error) {
            console.error("Erro ao deletar:", error.message);
            res.status(500).json({ message: "Erro ao excluir o produto. Verifique se ele possui vendas vinculadas." });
        }
    }
};

module.exports = productController;