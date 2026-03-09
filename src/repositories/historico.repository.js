const db = require('../config/database');

class HistoricoRepository {
    async create({ chamadoId, statusAnterior, statusNovo, observacao }) {
        const result = await db.run(
            `INSERT INTO historico_status (chamado_id, status_anterior, status_novo, observacao) 
       VALUES (?, ?, ?, ?)`,
            [chamadoId, statusAnterior, statusNovo, observacao]
        );
        return result.id;
    }

    async findByChamadoId(chamadoId) {
        return await db.all(
            `SELECT * FROM historico_status WHERE chamado_id = ? ORDER BY data_alteracao DESC`,
            [chamadoId]
        );
    }
}

module.exports = new HistoricoRepository();
