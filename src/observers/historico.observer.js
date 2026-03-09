const EventEmitter = require('events');
const historicoRepository = require('../repositories/historico.repository');

class StatusEventManager extends EventEmitter { }

const statusEvent = new StatusEventManager();

// O Padrão Observer: Esta função se inscreve para ouvir o evento 'statusChanged'
statusEvent.on('statusChanged', async (data) => {
    try {
        const { chamadoId, statusAnterior, statusNovo, observacao } = data;
        await historicoRepository.create({
            chamadoId,
            statusAnterior,
            statusNovo,
            observacao
        });
        console.log(`[Observer] Histórico atualizado para chamado ${chamadoId}: ${statusAnterior || 'CRIADO'} -> ${statusNovo}`);
    } catch (err) {
        console.error(`[Observer Error] Erro ao salvar histórico do chamado:`, err);
    }
});

module.exports = statusEvent;
