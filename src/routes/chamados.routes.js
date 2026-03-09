const express = require('express');
const chamadoController = require('../controllers/chamado.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Todas as rotas de chamados precisam de autenticação
router.use(authMiddleware);

router.post('/', chamadoController.criar);
router.get('/', chamadoController.listar);
router.put('/:id', chamadoController.atualizar);
router.delete('/:id', chamadoController.deletar);

// Rota específica para a transição de status
router.patch('/:id/status', chamadoController.alterarStatus);

module.exports = router;
