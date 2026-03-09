-- Inserir Categorias Básicas
INSERT INTO categorias (nome, descricao) VALUES 
('Resgate', 'Pedidos urgentes de resgate aéreo, aquático ou terrestre.'),
('Abrigo', 'Necessidade de alojamento temporário para desabrigados.'),
('Suprimentos', 'Pedidos de água, alimentos, roupas ou medicamentos.'),
('Desobstrução', 'Solicitação para limpar vias obstruídas por escombros ou árvores.');

-- Inserir Usuário Administrador (A senha '123456' virá hasheada, estamos inserindo o hash dela com bcrypt salt 10)
-- BCRYPT hash de '123456' é $2b$10$T87pA9YmJv8I3Kx918lK5.yW.B280r.GqW9X5w5Q9y.R5F9H8g5XW
INSERT INTO usuarios (nome, email, senha) VALUES 
('Administrador Geral', 'admin@central.gov', '$2b$10$T87pA9YmJv8I3Kx918lK5.yW.B280r.GqW9X5w5Q9y.R5F9H8g5XW'),
('João Cidadão', 'joao@email.com', '$2b$10$T87pA9YmJv8I3Kx918lK5.yW.B280r.GqW9X5w5Q9y.R5F9H8g5XW');

-- Inserir alguns chamados
INSERT INTO chamados (usuario_id, categoria_id, descricao, cep, cidade, uf, prioridade, status) VALUES 
(2, 3, 'Precisamos urgente de água potável no bairro.', '01001-000', 'São Paulo', 'SP', 'ALTA', 'ABERTO'),
(2, 2, 'Família com 4 pessoas desabrigadas precisam de local para dormir.', '04538-133', 'São Paulo', 'SP', 'MEDIA', 'EM_ATENDIMENTO');

-- Inserir histórico
INSERT INTO historico_status (chamado_id, status_anterior, status_novo, observacao) VALUES 
(1, NULL, 'ABERTO', 'Chamado criado pelo usuário.'),
(2, NULL, 'ABERTO', 'Chamado criado.'),
(2, 'ABERTO', 'EM_ATENDIMENTO', 'Enviamos uma equipe de suporte.');
