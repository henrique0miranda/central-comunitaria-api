const express = require('express');
const relatorioController = require('../controllers/relatorio.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/indicadores', relatorioController.indicadores);

router.get('/geral', relatorioController.geral);

module.exports = router;
