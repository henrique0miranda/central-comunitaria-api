const relatorioRepository = require('../repositories/relatorio.repository');

class RelatorioService {
    async obterIndicadoresGerais() {
        return await relatorioRepository.getIndicadores();
    }

    async obterRelatorioGeral(filtros) {
        return await relatorioRepository.getRelatoriosAvancados(filtros);
    }
}

module.exports = new RelatorioService();
