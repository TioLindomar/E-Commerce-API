// * Rotas da autentificação

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware')

router.post('/', authMiddleware.validateRegister, authController.registerUser); // O POST é usado para registrar, então é tecnicamente correto deixar essa a rota padrão
router.post('/login', authMiddleware.validateLogin, authController.loginUser);

module.exports = router;