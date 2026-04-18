const express = require('express');
const router = express.Router();

// Caminho corrigido: volta um nível para 'api' e entra em 'controllers'
const productController = require('../controllers/productController');

router.get('/', productController.findAll);
router.post('/', productController.create);
router.delete('/:id', productController.delete);

module.exports = router;