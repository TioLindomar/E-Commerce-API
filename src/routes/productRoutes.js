const express = require('express'); // 1 - Importação do express (semelhante à importação do React)
const router = express.Router();    // 2 - Cria um objeto Router para gerenciar as rotas (/products ou /users)
const productController = require('../controllers/productController'); // 3 - Importa o controller e suas funções

router.post('/', productController.createProduct); // 4 - Se tiver um POST nessa rota, é chamada a função createProduct

module.exports = router; // 5 - Exportamos o router