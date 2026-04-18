const express = require('express');
const router = express.Router();

// O ERRO ESTAVA AQUI: Você estava chamando o Repository em vez do Controller
// Certifique-se de que o nome do arquivo na pasta controllers é productController.js
const productController = require('../controllers/productController');

// Rota para listar todos os produtos
router.get('/', productController.findAll);

// Rota para cadastrar um novo produto
router.post('/', productController.create);

// Rota para excluir um produto pelo ID
router.delete('/:id', productController.delete);

module.exports = router;