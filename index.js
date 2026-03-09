require('dotenv').config();
const app = require('./src/app');
const db = require('./src/config/database');

const PORT = process.env.PORT || 3000;

// Inicializa o banco de dados (Cria tabelas e seeds se não existirem)
async function startServer() {
    try {
        // db é uma instância do Singleton
        await db.initDb();

        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    } catch (error) {
        console.error('Falha ao iniciar a aplicação:', error);
        process.exit(1);
    }
}

startServer();
