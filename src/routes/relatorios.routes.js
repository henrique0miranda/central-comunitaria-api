const express = require('express');
const relatorioController = require('../controllers/relatorio.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Proteção da rota
router.use(authMiddleware);

// Endpoint de indicadores resumidos
router.get('/indicadores', relatorioController.indicadores);

// Endpoint de relatório completo (aceita query params: dataInicio, dataFim, status, categoriaId)
router.get('/geral', relatorioController.geral);

module.exports = router;
