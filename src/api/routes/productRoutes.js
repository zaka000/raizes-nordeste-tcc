const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Se o controller exporta 'register', aqui deve ser .register
router.post('/', productController.register); 

// Se o controller exporta 'list', aqui deve ser .list
router.get('/', productController.list);

module.exports = router;