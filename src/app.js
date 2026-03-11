const express = require('express');
const loggerMiddleware = require('./middlewares/logger.middleware');
const errorHandler = require('./middlewares/error.middleware');
const AppError = require('./utils/AppError');

const app = express();

app.use(express.json());

app.use(loggerMiddleware);

app.get('/api/health', (req, res) => {
    res.status(200).json({ success: true, message: 'API Central Comunitária rodando!' });
});

const usuariosRouter = require('./routes/usuarios.routes');
const categoriasRouter = require('./routes/categorias.routes');
const chamadosRouter = require('./routes/chamados.routes');
const relatoriosRouter = require('./routes/relatorios.routes');

app.use('/api/usuarios', usuariosRouter);
app.use('/api/categorias', categoriasRouter);
app.use('/api/chamados', chamadosRouter);
app.use('/api/relatorios', relatoriosRouter);

app.all(/(.*)/, (req, res, next) => {
    next(new AppError(`Rota ${req.originalUrl} não foi encontrada neste servidor!`, 404));
});

app.use(errorHandler);

module.exports = app;
