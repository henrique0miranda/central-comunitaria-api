const categoriaRepository = require('../repositories/categoria.repository');

class CategoriaController {
    async listar(req, res, next) {
        try {
            const categorias = await categoriaRepository.findAll();

            res.status(200).json({
                success: true,
                data: categorias
            });
        } catch (error) {
            next(error);
        }
    }

    async obterPorId(req, res, next) {
        try {
            const categoria = await categoriaRepository.findById(req.params.id);

            if (!categoria) {
                return res.status(404).json({
                    success: false,
                    message: 'Categoria não encontrada.'
                });
            }

            res.status(200).json({
                success: true,
                data: categoria
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CategoriaController();
