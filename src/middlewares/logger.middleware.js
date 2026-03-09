/**
 * Middleware de log para registrar requisições e respostas
 * Regra: "Deve ser implementado um middleware de log registrando data, método, rota e status das requisições."
 */
const loggerMiddleware = (req, res, next) => {
    const start = Date.now();

    // Intercepta a finalização da resposta para pegar o status code final
    res.on('finish', () => {
        const duration = Date.now() - start;
        const date = new Date().toISOString();
        const method = req.method;
        const url = req.originalUrl;
        const status = res.statusCode;

        console.log(`[${date}] ${method} ${url} - Status: ${status} - ${duration}ms`);
    });

    next();
};

module.exports = loggerMiddleware;
