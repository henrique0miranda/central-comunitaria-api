const express = require('express');
const loggerMiddleware = require('./middlewares/logger.middleware');
const errorHandler = require('./middlewares/error.middleware');
const AppError = require('./utils/AppError');

const app = express();

// Middlewares embutidos
app.use(express.json());

// Middleware customizado de log
app.use(loggerMiddleware);

// Rota inicial de saúde
app.get('/api/health', (req, res) => {
    res.status(200).json({ success: true, message: 'API Central Comunitária rodando!' });
});

const usuariosRouter = require('./routes/usuarios.routes');
const categoriasRouter = require('./routes/categorias.routes');
const chamadosRouter = require('./routes/chamados.routes');
const relatoriosRouter = require('./routes/relatorios.routes');

// AQUI SERÃO MONTADAS AS ROTAS FUTURAS DA APLICAÇÃO
app.use('/api/usuarios', usuariosRouter);
app.use('/api/categorias', categoriasRouter);
app.use('/api/chamados', chamadosRouter);
app.use('/api/relatorios', relatoriosRouter);

// Tratamento de Rota Não Encontrada
app.all(/(.*)/, (req, res, next) => {
    next(new AppError(`Rota ${req.originalUrl} não foi encontrada neste servidor!`, 404));
});

// Tratamento Global de Erros
app.use(errorHandler);

module.exports = app;
