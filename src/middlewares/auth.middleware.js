const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

const authMiddleware = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('Você não está logado! Por favor, faça login para ter acesso.', 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Anexa as informações do usuário do payload do token na request
        req.usuario = {
            id: decoded.id,
            email: decoded.email
        };

        next();
    } catch (err) {
        return next(new AppError('Token inválido ou expirado.', 401));
    }
};

module.exports = authMiddleware;
