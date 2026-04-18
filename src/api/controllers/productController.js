const productRepository = require('../../infrastructure/repositories/productRepository');

const productController = {
    // Verifique se o nome aqui é 'register'
    register: async (req, res) => {
        try {
            const { nome, preco, categoria } = req.body;
            await productRepository.create(nome, preco, categoria);
            res.status(201).json({ message: "Produto cadastrado com sucesso!" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    
    list: async (req, res) => {
        try {
            const products = await productRepository.findAll();
            res.json(products);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

// Certifique-se de que está exportando o objeto corretamente
module.exports = productController;