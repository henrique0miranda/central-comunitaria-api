class ChamadoFactory {
    static criarChamado(usuarioId, payload, categoriaIdentificador) {
        let chamadoProps = {
            usuario_id: usuarioId,
            categoria_id: payload.categoria_id,
            descricao: payload.descricao,
            cep: payload.cep,
            status: 'ABERTO'
        };

        switch (categoriaIdentificador) {
            case 'Resgate':
                chamadoProps.prioridade = 'ALTA';
                break;
            case 'Abrigo':
            case 'Suprimentos':
                chamadoProps.prioridade = payload.prioridade || 'MEDIA';
                break;
            case 'Desobstrução':
                chamadoProps.prioridade = payload.prioridade || 'BAIXA';
                break;
            default:
                chamadoProps.prioridade = payload.prioridade || 'BAIXA';
                break;
        }

        chamadoProps.cidade = payload.cidade || null;
        chamadoProps.uf = payload.uf || null;

        return chamadoProps;
    }
}

module.exports = ChamadoFactory;
