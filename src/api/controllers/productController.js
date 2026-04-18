// IMPORTANTE: O caminho deve ser idêntico ao nome da pasta no seu VS Code/GitHub
// Se a pasta for 'repositories' e o arquivo 'productRepository.js', mantenha assim:
const productRepository = require('../repositories/productRepository');

const productController = {
    // 1. Listar todos os produtos
    findAll: async (req, res) => {
        try {
            const products = await productRepository.findAll();
            res.json(products);
        } catch (error) {
            console.error("🚨 Erro ao buscar produtos:", error.message);
            res.status(500).json({ message: "Erro ao carregar a lista de produtos." });
        }
    },

    // 2. Criar novo produto
    create: async (req, res) => {
        try {
            const { nome, preco, categoria } = req.body;

            if (!nome || !preco) {
                return res.status(400).json({ message: "Nome e preço são obrigatórios!" });
            }

            await productRepository.create(nome, preco, categoria);
            res.status(201).json({ message: "Produto cadastrado com sucesso! 🌵" });
        } catch (error) {
            console.error("🚨 Erro ao criar produto:", error.message);
            res.status(500).json({ message: "Não foi possível cadastrar o produto." });
        }
    },

    // 3. Excluir produto (O que você precisava!)
    delete: async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ message: "ID do produto não informado." });
            }

            // Chama a função do repository que limpa o estoque e apaga o produto
            const result = await productRepository.delete(id);

            if (result && result.affectedRows > 0) {
                res.json({ message: "Produto removido com sucesso!" });
            } else {
                res.status(404).json({ message: "Produto não encontrado no banco de dados." });
            }
        } catch (error) {
            // Esse erro geralmente acontece se houver uma trava de chave estrangeira (pedido vinculado)
            console.error("🚨 Erro ao deletar produto:", error.message);
            res.status(500).json({ 
                message: "Erro ao excluir: verifique se o produto possui vendas registradas." 
            });
        }
    }
};

module.exports = productController;