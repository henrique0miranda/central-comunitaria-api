const express = require('express');
const chamadoController = require('../controllers/chamado.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/', chamadoController.criar);
router.get('/', chamadoController.listar);
router.put('/:id', chamadoController.atualizar);
router.delete('/:id', chamadoController.deletar);

router.patch('/:id/status', chamadoController.alterarStatus);

module.exports = router;
