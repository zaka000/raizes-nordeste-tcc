const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/', orderController.create);

router.get('/', orderController.listAll);

router.get('/itens/:id', orderController.getDetails);

module.exports = router;