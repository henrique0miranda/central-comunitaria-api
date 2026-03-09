# Central Comunitária API

API completa, organizada e segura para uma central comunitária que recebe chamados de apoio em desastres naturais, organiza atendimentos e gera relatórios para decisão rápida.

## 📋 Requisitos e Padrões Atendidos

- **Domínio e Regras de Negócio**: Cadastro/Login; Chamados com CRUD, busca de CEP no ViaCEP, Regras de prioridade por categoria, Fluxo de status exigido (`ABERTO -> EM_ATENDIMENTO -> CONCLUIDO`).
- **Banco de Dados (Relacional)**: Uso de SQLite contendo tabelas de `usuarios`, `categorias`, `chamados`, `historico_status` com as relativas PK e FK. Foi utilizado um script SQL para criar as tabelas e seeds de dados. Operações de UPDATE/DELETE com filtros de segurança; JOINs nos relatórios.
- **Padrões de Arquitetura**: Separação clara em `controllers`, `services`, `repositories`, `middlewares` e `routes` (MVC/N-camadas).
- **Design Patterns**: 
  - **Singleton**: Conexão com o banco (`src/config/database.js`).
  - **Factory**: Criação de dados do chamado com regras específicas de negócio (`src/utils/ChamadoFactory.js`).
  - **Observer**: Salvar na tabela do histórico toda vez que um status do chamado é alterado (`src/observers/historico.observer.js`).
- **Segurança**: Autenticação com JWT e Senhas com Hash bcrypt. Middlewares globais de erro para não expor rastros do sistema e Logging de requisições.

## 🛠️ Tecnologias Utilizadas

- **Node.js** com **Express**
- **SQLite3** (Driver nativo rodando raw SQL localmente)
- **jsonwebtoken** / **bcrypt** para autenticação e segurança
- **axios** para a integração externa (ViaCEP)
- **dotenv** para variáveis de ambiente

## 🚀 Como Rodar o Projeto

1. **Clone do repositório / Descompacte o `.zip`**
2. Acesse a pasta do projeto e instale as dependências:
   ```bash
   npm install
   ```
3. O projeto utiliza um sistema interno para **montar automaticamente as tabelas e os seeds** caso o arquivo de banco (`database.sqlite`) não exista. Certifique-se de não modificá-los de antemão ou apague o arquivo `database.sqlite` se quiser dar reset no banco.
4. Rode a aplicação em modo dev ou normal:
   ```bash
   npm run dev
   # ou
   node index.js
   ```
   * O servidor iniciará na porta `3000`. Crie seu arquivo `.env` baseado nas chaves se preferir (por padrão ele utilizará o `.env` se fornecido).

## 🗄️ Entregáveis do Projeto

No repositório (diretório raiz) você vai encontrar:
1. `schema.sql`: Script SQL com as criações das 4 tabelas e PKs/FKs.
2. `seed.sql`: Script SQL com inserções base (já executadas através do NodeJS).
3. `Postman_Collection.json`: Coleção prontas para importar no Postman e testar todos os cenários, endpoints protegidos e públicos.

## 👥 Credenciais de Teste
O `seed.sql` insere os seguintes usuários cujas senhas já são '123456'.
- `admin@central.gov` (Senha: `123456`)
- `joao@email.com` (Senha: `123456`)

Faça o login (`POST /api/usuarios/login`) com este usuário no Postman, copie o token retornado e configure a Authorization "Bearer Token" nas demais requisições. O usuário Joao Cidadão possui um `usuario_id = 2` e ele criou dois chamados padrão para testes que ele pode deletar ou editar.

## 💡 Fluxo Básico de Uso da API

1. **Registrar um novo usuário** ou **Fazer Login**.
2. **Listar as Categorias** disponíveis (`GET /api/categorias`).
3. **Criar um Chamado** (`POST /api/chamados`) fornecendo o `categoria_id` (ex: 3), descricao, cep e prioridade opcional. O ViaCep buscará Cidade e Estado sozinho.
4. **Verificar Chamados Abertos** (`GET /api/chamados`).
5. **Atualizar o Fluxo** (`PATCH /api/chamados/:id/status` para `EM_ATENDIMENTO`). 
6. E extrair estatísticas usando a Rota de Indicadores e Relatórios: `GET /api/relatorios/indicadores` e `GET /api/relatorios/geral`.
