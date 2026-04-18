const express = require('express');
const router = express.Router();
const path = require('path');

// Esse comando encontra o arquivo pelo caminho real no servidor, sem erro de ../
const productController = require(path.join(__dirname, '..', 'controllers', 'productController.js'));

router.get('/', productController.findAll);
router.post('/', productController.create);
router.delete('/:id', productController.delete);

module.exports = router;