const usuarioService = require('../services/usuario.service');

class UsuarioController {
    async registrar(req, res, next) {
        try {
            const { nome, email, senha } = req.body;
            const novoUsuario = await usuarioService.registrarUsuario(nome, email, senha);

            res.status(201).json({
                success: true,
                message: 'Usuário registrado com sucesso.',
                data: novoUsuario
            });
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const { email, senha } = req.body;
            const dadosAuth = await usuarioService.autenticarUsuario(email, senha);

            res.status(200).json({
                success: true,
                message: 'Login realizado com sucesso.',
                data: dadosAuth
            });
        } catch (error) {
            next(error);
        }
    }

    async perfil(req, res, next) {
        try {
            // req.usuario foi inserido pelo middleware de autenticação
            const usuario = await usuarioService.obterPerfil(req.usuario.id);

            res.status(200).json({
                success: true,
                data: usuario
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UsuarioController();
