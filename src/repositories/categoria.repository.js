const db = require('../config/database');

class CategoriaRepository {
    async findAll() {
        return await db.all('SELECT * FROM categorias ORDER BY nome ASC');
    }

    async findById(id) {
        return await db.get('SELECT * FROM categorias WHERE id = ?', [id]);
    }
}

module.exports = new CategoriaRepository();
