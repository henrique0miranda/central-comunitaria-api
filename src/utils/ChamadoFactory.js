/**
 * Padrão Factory
 * Utilizado para instanciar as propriedades base de um chamado dependendo de certas regras associadas ao tipo (ou categoria).
 */
class ChamadoFactory {
    static criarChamado(usuarioId, payload, categoriaIdentificador) {
        // Valores padrões que todas as categorias possuem
        let chamadoProps = {
            usuario_id: usuarioId,
            categoria_id: payload.categoria_id,
            descricao: payload.descricao,
            cep: payload.cep,
            status: 'ABERTO'
        };

        // Aplicar regras baseadas em tipos/categorias
        switch (categoriaIdentificador) {
            case 'Resgate':
                // Resgates sempre recebem prioridade ALTA por padrão se não vier especificada, mas vamos focar em forçar ALTA.
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

        // Se o usuário já informou cidade/UF manual (caso o CEP falhe antes), usamos isso. Senão deixamos null para o ViaCEP preencher.
        chamadoProps.cidade = payload.cidade || null;
        chamadoProps.uf = payload.uf || null;

        return chamadoProps;
    }
}

module.exports = ChamadoFactory;
