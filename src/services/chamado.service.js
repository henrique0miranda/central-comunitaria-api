const chamadoRepository = require('../repositories/chamado.repository');
const categoriaRepository = require('../repositories/categoria.repository');
const viaCepService = require('./viacep.service');
const AppError = require('../utils/AppError');
const ChamadoFactory = require('../utils/ChamadoFactory');
const statusObserver = require('../observers/historico.observer');

class ChamadoService {
    async criarChamado(usuarioId, payload) {
        // Recupera a categoria para poder aplicar regras através do Factory
        const categoria = await categoriaRepository.findById(payload.categoria_id);
        if (!categoria) throw new AppError('Categoria informada é inválida.', 400);

        // Integração ViaCEP
        let endereco = null;
        try {
            endereco = await viaCepService.buscarEnderecoPorCep(payload.cep);
            payload.cidade = endereco.cidade;
            payload.uf = endereco.uf;
        } catch (err) {
            throw new AppError('Falha ao obter endereço da API Externa ViaCEP para o CEP informado.', 400);
        }

        // Padrão Factory criando o objeto a ser salvo de acordo com as regras de negócio de categorias
        const novoChamadoProps = ChamadoFactory.criarChamado(usuarioId, payload, categoria.nome);

        const chamadoId = await chamadoRepository.create(novoChamadoProps);

        // Dispara evento (Padrão Observer)
        statusObserver.emit('statusChanged', {
            chamadoId,
            statusAnterior: null,
            statusNovo: novoChamadoProps.status,
            observacao: 'Abertura do chamado.'
        });

        return await chamadoRepository.findById(chamadoId);
    }

    async atualizarChamado(id, usuarioId, atualizarProps) {
        const chamado = await chamadoRepository.findById(id);
        if (!chamado) throw new AppError('Chamado não encontrado.', 404);

        // Regra de segurança para update: um usuário da web só pode atualizar chamados que pertencem a ele
        if (chamado.usuario_id !== usuarioId) {
            throw new AppError('Você não tem permissão para atualizar este chamado.', 403);
        }

        const colunasPermitidas = ['descricao', 'prioridade']; // Não permitiremos mudar de categoria ou CEP facilmente para manter simplicidade
        let modificacoes = {};
        for (const [key, value] of Object.entries(atualizarProps)) {
            if (colunasPermitidas.includes(key) && value) {
                modificacoes[key] = value;
            }
        }

        if (Object.keys(modificacoes).length === 0) {
            throw new AppError('Nenhum dado válido fornecido para atualização.', 400);
        }

        await chamadoRepository.update(id, modificacoes, usuarioId);

        return await chamadoRepository.findById(id);
    }

    async evoluirStatus(id, novoStatus) {
        const chamado = await chamadoRepository.findById(id);
        if (!chamado) throw new AppError('Chamado não encontrado.', 404);

        const fluxoValido = {
            'ABERTO': ['EM_ATENDIMENTO', 'CONCLUIDO'], // dependendo da sua regra de negócio pode ir p concluido
            'EM_ATENDIMENTO': ['CONCLUIDO'],
            'CONCLUIDO': []
        };

        // Regra rígida: ABERTO -> EM_ATENDIMENTO -> CONCLUIDO
        const transicaoEspecifica = {
            'ABERTO': 'EM_ATENDIMENTO',
            'EM_ATENDIMENTO': 'CONCLUIDO'
        };

        if (novoStatus !== transicaoEspecifica[chamado.status]) {
            throw new AppError(`Transição de status inválida. Fluxo esperado: ABERTO -> EM_ATENDIMENTO -> CONCLUIDO. O status atual é ${chamado.status}.`, 400);
        }

        await chamadoRepository.updateStatus(id, novoStatus);

        // Dispara evento para o Observer de histórico
        statusObserver.emit('statusChanged', {
            chamadoId: id,
            statusAnterior: chamado.status,
            statusNovo: novoStatus,
            observacao: 'Mudança de status no fluxo de atendimento.'
        });

        return await chamadoRepository.findById(id);
    }

    async deletarChamado(id, usuarioId) {
        const chamado = await chamadoRepository.findById(id);
        if (!chamado) throw new AppError('Chamado não encontrado.', 404);

        if (chamado.usuario_id !== usuarioId) {
            throw new AppError('Você não tem permissão para excluir este chamado.', 403);
        }

        // Regra opcional: não deletar chamados concluídos, etc.
        if (chamado.status === 'CONCLUIDO') {
            throw new AppError('Não é possível excluir um chamado já concluído.', 400);
        }

        const deleted = await chamadoRepository.delete(id, usuarioId);
        if (!deleted) {
            throw new AppError('Erro ao deletar chamado.', 500);
        }

        return { message: 'Chamado apagado com sucesso.' };
    }

    async listarTodos() {
        return await chamadoRepository.findAll();
    }
}

module.exports = new ChamadoService();
