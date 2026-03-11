const express = require('express');
const categoriaController = require('../controllers/categoria.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', categoriaController.listar);
router.get('/:id', categoriaController.obterPorId);

module.exports = router;
