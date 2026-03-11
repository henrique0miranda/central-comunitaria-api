const loggerMiddleware = (req, res, next) => {
    const start = Date.now();

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
