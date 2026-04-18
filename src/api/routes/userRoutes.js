const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Rota de Login real
router.post('/login', userController.login);
router.post('/register', userController.register);

module.exports = router;