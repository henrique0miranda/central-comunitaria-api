const db = require('../config/database');

class RelatorioRepository {
  async getIndicadores() {
    const totalPorStatus = await db.all(`
      SELECT status, COUNT(*) as total 
      FROM chamados 
      GROUP BY status
    `);

    const categoriaRecorrente = await db.get(`
      SELECT cat.nome, COUNT(c.id) as total_chamados
      FROM chamados c
      JOIN categorias cat ON c.categoria_id = cat.id
      GROUP BY c.categoria_id
      ORDER BY total_chamados DESC
      LIMIT 1
    `);

    const tempoMedioConclusao = await db.get(`
      SELECT AVG(julianday(atualizado_em) - julianday(criado_em)) as tempo_medio_dias
      FROM chamados
      WHERE status = 'CONCLUIDO'
    `);

    return {
      totalPorStatus,
      categoriaRecorrente,
      tempoMedioConclusao: tempoMedioConclusao ? (tempoMedioConclusao.tempo_medio_dias * 24).toFixed(2) + ' horas' : 'N/A'
    };
  }

  async getRelatoriosAvancados({ dataInicio, dataFim, status, categoriaId }) {
    let baseQuery = `
      SELECT 
        c.id as chamado_id,
        c.descricao,
        c.prioridade,
        c.status,
        c.cidade,
        c.uf,
        c.criado_em,
        cat.nome as categoria_nome,
        u.nome as relator_nome,
        u.email as relator_email
      FROM chamados c
      JOIN categorias cat ON c.categoria_id = cat.id
      JOIN usuarios u ON c.usuario_id = u.id
      WHERE 1=1
    `;

    const params = [];

    if (dataInicio) {
      baseQuery += ` AND c.criado_em >= ?`;
      params.push(dataInicio);
    }

    if (dataFim) {
      baseQuery += ` AND c.criado_em <= ?`;
      params.push(dataFim + ' 23:59:59');
    }

    if (status) {
      baseQuery += ` AND c.status = ?`;
      params.push(status);
    }

    if (categoriaId) {
      baseQuery += ` AND c.categoria_id = ?`;
      params.push(categoriaId);
    }

    baseQuery += ` ORDER BY c.criado_em DESC`;

    return await db.all(baseQuery, params);
  }
}

module.exports = new RelatorioRepository();
