const axios = require('axios');
const AppError = require('../utils/AppError');

class ViaCepService {
    async buscarEnderecoPorCep(cep) {
        if (!cep) {
            throw new AppError('CEP é obrigatório.', 400);
        }

        // Remove traços e espaços, caso houver
        const cepLimpo = cep.replace(/\D/g, '');

        if (cepLimpo.length !== 8) {
            throw new AppError('CEP inválido. Deve conter 8 dígitos.', 400);
        }

        try {
            const { data } = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`);

            if (data.erro) {
                throw new AppError('CEP não encontrado na base do ViaCEP.', 404);
            }

            // Retornar apenas os dados relevantes de cidade e estado
            return {
                cidade: data.localidade,
                uf: data.uf,
                cep: data.cep
            };
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError('Falha ao comunicar com o serviço ViaCEP.', 502);
        }
    }
}

module.exports = new ViaCepService();
