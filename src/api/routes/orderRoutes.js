const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// ROTA PRINCIPAL DE VENDAS
router.post('/', orderController.create);

// Rota para listar todos os pedidos
router.get('/', orderController.listAll);

// Rota para detalhes do pedido
router.get('/itens/:id', orderController.getDetails);

module.exports = router;