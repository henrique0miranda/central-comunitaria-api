const db = require('../config/database');

class ChamadoRepository {
    async create(chamadoDado) {
        const { usuario_id, categoria_id, descricao, cep, cidade, uf, prioridade, status } = chamadoDado;
        const result = await db.run(
            `INSERT INTO chamados (usuario_id, categoria_id, descricao, cep, cidade, uf, prioridade, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [usuario_id, categoria_id, descricao, cep, cidade, uf, prioridade, status]
        );
        return result.id;
    }

    async findById(id) {
        return await db.get(`SELECT * FROM chamados WHERE id = ?`, [id]);
    }

    async findAll() {
        return await db.all(`
      SELECT c.id, c.descricao, c.cep, c.cidade, c.uf, c.prioridade, c.status, c.criado_em, 
             u.nome as usuario_nome, cat.nome as categoria_nome
      FROM chamados c
      JOIN usuarios u ON c.usuario_id = u.id
      JOIN categorias cat ON c.categoria_id = cat.id
      ORDER BY c.criado_em DESC
    `);
    }

    async update(id, dadosEditaveis, usuarioIdForFilter) {
        const fields = [];
        const values = [];

        for (const [key, value] of Object.entries(dadosEditaveis)) {
            fields.push(`${key} = ?`);
            values.push(value);
        }

        // Atualiza apenas se tiver mudado alguma coisa e sempre restrito ao criador (usuario_id) ou se o sistema não necessita, mas como é seguro:
        fields.push("atualizado_em = CURRENT_TIMESTAMP");

        const query = `UPDATE chamados SET ${fields.join(', ')} WHERE id = ? AND usuario_id = ?`;
        values.push(id, usuarioIdForFilter);

        const result = await db.run(query, values);
        return result.changes > 0;
    }

    async updateStatus(id, newStatus) {
        const result = await db.run(
            `UPDATE chamados SET status = ?, atualizado_em = CURRENT_TIMESTAMP WHERE id = ?`,
            [newStatus, id]
        );
        return result.changes > 0;
    }

    async delete(id, usuarioId) {
        // Delete seguro, validando o ID e o dono do registro
        const result = await db.run(`DELETE FROM chamados WHERE id = ? AND usuario_id = ?`, [id, usuarioId]);
        return result.changes > 0; // Quantidade de linhas deletadas
    }
}

module.exports = new ChamadoRepository();
