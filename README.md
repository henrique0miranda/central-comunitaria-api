# Central Comunitária API
API para uma central comunitária que recebe chamados de apoio em desastres naturais, organiza atendimentos e gera relatórios para decisão rápida.

## Como Rodar o Projeto
1. Clone do repositório / Descompacte o `.zip`
2. Acesse a pasta do projeto e instale as dependências: npm install
3. O projeto monta automaticamente as tabelas e os seeds caso o arquivo de banco (`database.sqlite`) não exista.
4. Rode a aplicação com: npm run dev
5. O servidor iniciará na porta `3000`.

## Arquivos do Projeto
1. `schema.sql`: Script SQL com as criações das tabelas.
2. `seed.sql`: Script SQL com inserções base.
3. `postman.json`: Coleção para importar no Postman e testar todos os cenários.

## Usuários de Teste
O `seed.sql` insere os seguintes usuários:
- `admin@central.gov` (Senha: `123456`)
- `joao@email.com` (Senha: `123456`)

## Como Testar
Faça o login (`POST /api/usuarios/login`) com este usuário no Postman, copie o token retornado e configure a Authorization "Bearer Token" nas demais requisições.

## Endpoints
1. Registrar um novo usuário ou Fazer Login.
2. Listar as Categorias disponíveis (`GET /api/categorias`).
3. Criar um Chamado (`POST /api/chamados`) fornecendo o `categoria_id` (ex: 3), descricao, cep e prioridade opcional. O ViaCep buscará Cidade e Estado sozinho.
4. Verificar Chamados Abertos (`GET /api/chamados`).
5. Atualizar o Fluxo (`PATCH /api/chamados/:id/status` para `EM_ATENDIMENTO`). 
6. Extrair estatísticas (`GET /api/relatorios/indicadores` e `GET /api/relatorios/geral`).
