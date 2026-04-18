const express = require('express');
const router = express.Router();
const unitController = require('../controllers/unitController');

// Rota para cadastrar (POST)
router.post('/register', unitController.addUnit);

// Rota para listar todas (GET)
router.get('/', unitController.listUnits);

module.exports = router;