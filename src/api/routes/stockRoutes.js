const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

router.get('/', stockController.listAll);
router.post('/add', stockController.addStock);
router.get('/unit/:id', stockController.getUnitStock);

module.exports = router;