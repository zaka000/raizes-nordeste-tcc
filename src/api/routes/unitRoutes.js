const express = require('express');
const router = express.Router();
const unitController = require('../controllers/unitController');

router.post('/register', unitController.addUnit);

router.get('/', unitController.listUnits);

module.exports = router;