// Importando o repository com a extensão .js
const productRepository = require('../repositories/productRepository.js');

const productController = {
    findAll: async (req, res) => {
        try {
            const products = await productRepository.findAll();
            res.json(products);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    create: async (req, res) => {
        try {
            const { nome, preco, categoria } = req.body;
            await productRepository.create(nome, preco, categoria);
            res.status(201).json({ message: "Produto criado!" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await productRepository.delete(id);
            if (result.affectedRows > 0) {
                res.json({ message: "Excluído com sucesso" });
            } else {
                res.status(404).json({ message: "Não encontrado" });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = productController;