const relatorioService = require('../services/relatorio.service');

class RelatorioController {
    async indicadores(req, res, next) {
        try {
            const dados = await relatorioService.obterIndicadoresGerais();
            res.status(200).json({
                success: true,
                data: dados
            });
        } catch (error) {
            next(error);
        }
    }

    async geral(req, res, next) {
        try {
            const relatorios = await relatorioService.obterRelatorioGeral(req.query);
            res.status(200).json({
                success: true,
                resultadosDaBusca: relatorios.length,
                data: relatorios
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new RelatorioController();
