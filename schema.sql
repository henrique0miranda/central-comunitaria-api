CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categorias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(50) NOT NULL UNIQUE,
    descricao TEXT
);

CREATE TABLE IF NOT EXISTS chamados (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    categoria_id INTEGER NOT NULL,
    descricao TEXT NOT NULL,
    cep VARCHAR(10) NOT NULL,
    cidade VARCHAR(100),
    uf VARCHAR(2),
    prioridade VARCHAR(20) NOT NULL CHECK(prioridade IN ('ALTA', 'MEDIA', 'BAIXA')),
    status VARCHAR(20) NOT NULL CHECK(status IN ('ABERTO', 'EM_ATENDIMENTO', 'CONCLUIDO')),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

CREATE TABLE IF NOT EXISTS historico_status (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chamado_id INTEGER NOT NULL,
    status_anterior VARCHAR(20),
    status_novo VARCHAR(20) NOT NULL CHECK(status_novo IN ('ABERTO', 'EM_ATENDIMENTO', 'CONCLUIDO')),
    data_alteracao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    observacao TEXT,
    FOREIGN KEY (chamado_id) REFERENCES chamados(id)
);
