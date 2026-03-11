const EventEmitter = require('events');
const historicoRepository = require('../repositories/historico.repository');

class StatusEventManager extends EventEmitter { }

const statusEvent = new StatusEventManager();

statusEvent.on('statusChanged', async (data) => {
    try {
        const { chamadoId, statusAnterior, statusNovo, observacao } = data;
        await historicoRepository.create({
            chamadoId,
            statusAnterior,
            statusNovo,
            observacao
        });
        console.log(`Histórico atualizado para chamado ${chamadoId}: ${statusAnterior || 'CRIADO'} -> ${statusNovo}`);
    } catch (erro) {
        console.error(`Erro ao salvar histórico do chamado:`, erro);
    }
});

module.exports = statusEvent;
