const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Rota que o seu fetch(`${API_URL}/orders/${pedidoId}/items`) chama
// Note que adicionamos o "/items" para ficar organizado
router.get('/itens/:id', orderController.getDetails);

module.exports = router;