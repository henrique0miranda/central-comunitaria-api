const chamadoService = require('../services/chamado.service');

class ChamadoController {
    async criar(req, res, next) {
        try {
            const chamado = await chamadoService.criarChamado(req.usuario.id, req.body);

            res.status(201).json({
                success: true,
                message: 'Chamado aberto com sucesso.',
                data: chamado
            });
        } catch (error) {
            next(error);
        }
    }

    async atualizar(req, res, next) {
        try {
            const { id } = req.params;
            const chamadoAtualizado = await chamadoService.atualizarChamado(id, req.usuario.id, req.body);

            res.status(200).json({
                success: true,
                message: 'Chamado atualizado com sucesso.',
                data: chamadoAtualizado
            });
        } catch (error) {
            next(error);
        }
    }

    async alterarStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const chamado = await chamadoService.evoluirStatus(id, status);

            res.status(200).json({
                success: true,
                message: 'Status do chamado atualizado com sucesso.',
                data: chamado
            });
        } catch (error) {
            next(error);
        }
    }

    async deletar(req, res, next) {
        try {
            const { id } = req.params;
            const result = await chamadoService.deletarChamado(id, req.usuario.id);

            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }

    async listar(req, res, next) {
        try {
            const chamados = await chamadoService.listarTodos();

            res.status(200).json({
                success: true,
                data: chamados
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ChamadoController();
