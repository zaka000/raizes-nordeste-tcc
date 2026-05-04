const express = require('express');
const router = express.Router();
const path = require('path');

const productController = require('../controllers/productController');

router.get('/', productController.findAll);
router.post('/', productController.create);
router.delete('/:id', productController.delete);

module.exports = router;