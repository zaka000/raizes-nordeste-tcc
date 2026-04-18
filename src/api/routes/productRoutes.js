const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// O Express trava se productController.create ou .findAll estiverem escritos errado
router.get('/', productController.findAll);
router.post('/', productController.create); // Verifique se está 'create' aqui
router.delete('/:id', productController.delete);

module.exports = router;