const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usuarioRepository = require('../repositories/usuario.repository');
const AppError = require('../utils/AppError');

class UsuarioService {
    async registrarUsuario(nome, email, senha) {
        if (!nome || !email || !senha) {
            throw new AppError('Nome, email e senha são obrigatórios.', 400);
        }

        const usuarioExistente = await usuarioRepository.findByEmail(email);
        if (usuarioExistente) {
            throw new AppError('Este e-mail já está em uso.', 400);
        }

        const saltRounds = 10;
        const senhaHash = await bcrypt.hash(senha, saltRounds);

        const novoId = await usuarioRepository.create(nome, email, senhaHash);

        return {
            id: novoId,
            nome,
            email
        };
    }

    async autenticarUsuario(email, senha) {
        if (!email || !senha) {
            throw new AppError('E-mail e senha são obrigatórios.', 400);
        }

        const usuario = await usuarioRepository.findByEmail(email);

        if (!usuario) {
            throw new AppError('Credenciais inválidas.', 401);
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            throw new AppError('Credenciais inválidas.', 401);
        }

        const token = jwt.sign(
            { id: usuario.id, email: usuario.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        return {
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email
            },
            token
        };
    }

    async obterPerfil(usuarioId) {
        const usuario = await usuarioRepository.findById(usuarioId);
        if (!usuario) {
            throw new AppError('Usuário não encontrado.', 404);
        }
        return usuario;
    }
}

module.exports = new UsuarioService();
