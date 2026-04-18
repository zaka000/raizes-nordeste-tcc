const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

// Quando o site pedir GET /stock, ele cai aqui:
router.get('/', stockController.listAll);
router.post('/add', stockController.addStock);
router.get('/unit/:id', stockController.getUnitStock);

module.exports = router;