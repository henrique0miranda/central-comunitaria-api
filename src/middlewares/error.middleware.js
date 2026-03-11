const AppError = require('../utils/AppError');

const errorHandler = (erro, req, res, next) => {
    erro.statusCode = erro.statusCode || 500;
    erro.status = erro.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        return res.status(erro.statusCode).json({
            success: false,
            status: erro.status,
            message: erro.message,
            stack: erro.stack,
        });
    }

    if (erro.isOperational) {
        return res.status(erro.statusCode).json({
            success: false,
            status: erro.status,
            message: erro.message,
        });
    }

    console.error('ERROR', erro);
    return res.status(500).json({
        success: false,
        status: 'error',
        message: 'Algo deu errado no servidor.',
    });
};

module.exports = errorHandler;
