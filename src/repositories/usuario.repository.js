const db = require('../config/database');

class UsuarioRepository {
    async findByEmail(email) {
        return await db.get('SELECT * FROM usuarios WHERE email = ?', [email]);
    }

    async findById(id) {
        return await db.get('SELECT id, nome, email, criado_em FROM usuarios WHERE id = ?', [id]);
    }

    async create(nome, email, senhaHash) {
        const result = await db.run(
            'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
            [nome, email, senhaHash]
        );
        return result.id;
    }
}

module.exports = new UsuarioRepository();
