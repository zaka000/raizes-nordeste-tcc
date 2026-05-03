const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// ROTA PRINCIPAL DE VENDAS: Recebe o pedido do site e cria no banco
router.post('/', orderController.create);

// Rota para listar todos os pedidos
router.get('/', orderController.listAll);

// Rota que o seu fetch chama para pegar os detalhes
router.get('/itens/:id', orderController.getDetails);

module.exports = router;