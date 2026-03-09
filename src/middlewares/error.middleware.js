const AppError = require('../utils/AppError');

/**
 * Middleware para tratamento global de erros
 * Padroniza a resposta de erro mantendo "success": false
 */
const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        return res.status(err.statusCode).json({
            success: false,
            status: err.status,
            message: err.message,
            stack: err.stack,
        });
    }

    // Se o erro foi identificado (operacional) envia a mensagem controlada
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            success: false,
            status: err.status,
            message: err.message,
        });
    }

    // Erros de programação ou pacotes logamos e retornamos um erro genérico
    console.error('ERROR 💥', err);
    return res.status(500).json({
        success: false,
        status: 'error',
        message: 'Algo deu errado no servidor.',
    });
};

module.exports = errorHandler;
