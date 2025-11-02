const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');

const app = express();

// Configurações CORS
app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // serve fotos

// Configuração MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'prodesk'
});

db.connect(err => {
  if (err) console.error('Erro ao conectar:', err);
  else console.log('✅ Conectado ao MySQL!');
});

// ========================
// Configuração Multer
// ========================
const storageUsuario = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, 'usuario_' + req.params.id + ext);
  }
});
const uploadUsuario = multer({ storage: storageUsuario });

const storageEspaco = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, 'espaco_' + Date.now() + ext);
  }
});
const uploadEspaco = multer({ storage: storageEspaco });

// ========================
// Rotas de autenticação
// ========================
const SALT_ROUNDS = 10;

// POST /api/login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });

  const query = 'SELECT * FROM usuarios WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro no servidor.' });
    if (results.length === 0) return res.status(404).json({ error: 'Usuário não encontrado.' });

    const usuario = results[0];
    bcrypt.compare(password, usuario.senha, (err, match) => {
      if (err) return res.status(500).json({ error: 'Erro ao verificar senha.' });
      if (!match) return res.status(401).json({ error: 'Senha incorreta.' });

      res.json({
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        foto: usuario.foto
      });
    });
  });
});

// POST /api/usuarios - cadastrar novo usuário
app.post('/api/usuarios', (req, res) => {
  const { name, email, cpf, password } = req.body;
  if (!name || !email || !cpf || !password) return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });

  const checkQuery = 'SELECT * FROM usuarios WHERE email = ? OR cpf = ?';
  db.query(checkQuery, [email, cpf], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro ao verificar usuário.' });
    if (results.length > 0) return res.status(400).json({ error: 'Usuário já cadastrado com este e-mail ou CPF.' });

    bcrypt.hash(password, SALT_ROUNDS, (err, hash) => {
      if (err) return res.status(500).json({ error: 'Erro ao processar senha.' });

      const insertQuery = 'INSERT INTO usuarios (nome, email, cpf, senha) VALUES (?, ?, ?, ?)';
      db.query(insertQuery, [name, email, cpf, hash], (err, result) => {
        if (err) return res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
        res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
      });
    });
  });
});

// ========================
// Rotas de perfil
// ========================
app.get('/api/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT id, nome, email, telefone, endereco, foto FROM usuarios WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar usuário' });
    if (results.length === 0) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(results[0]);
  });
});

app.put('/api/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const { nome, email, telefone, endereco } = req.body;

  const campos = [];
  const valores = [];

  if (nome) { campos.push('nome = ?'); valores.push(nome); }
  if (email) { campos.push('email = ?'); valores.push(email); }
  if (telefone) { campos.push('telefone = ?'); valores.push(telefone); }
  if (endereco) { campos.push('endereco = ?'); valores.push(endereco); }

  if (campos.length === 0) return res.status(400).json({ error: 'Nenhum dado para atualizar' });

  const query = `UPDATE usuarios SET ${campos.join(', ')} WHERE id = ?`;
  valores.push(id);

  db.query(query, valores, (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro ao atualizar usuário' });
    res.json({ message: 'Usuário atualizado com sucesso!' });
  });
});

app.put('/api/usuarios/:id/foto', uploadUsuario.single('foto'), (req, res) => {
  const { id } = req.params;
  if (!req.file) return res.status(400).json({ error: 'Arquivo não enviado' });

  const fotoPath = 'http://localhost:3000/' + req.file.path.replace(/\\/g, '/');
  const query = 'UPDATE usuarios SET foto = ? WHERE id = ?';
  db.query(query, [fotoPath, id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro ao atualizar foto' });
    res.json({ message: 'Foto atualizada com sucesso!', foto: fotoPath });
  });
});

app.put('/api/usuarios/:id/senha', (req, res) => {
  const { id } = req.params;
  const { senhaAtual, novaSenha } = req.body;

  if (!senhaAtual || !novaSenha) return res.status(400).json({ error: 'Informe a senha atual e a nova senha.' });

  const query = 'SELECT senha FROM usuarios WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar usuário.' });
    if (results.length === 0) return res.status(404).json({ error: 'Usuário não encontrado.' });

    const senhaHash = results[0].senha;

    bcrypt.compare(senhaAtual, senhaHash, (err, match) => {
      if (err) return res.status(500).json({ error: 'Erro ao verificar senha.' });
      if (!match) return res.status(401).json({ error: 'Senha atual incorreta.' });

      bcrypt.hash(novaSenha, 10, (err, novaHash) => {
        if (err) return res.status(500).json({ error: 'Erro ao criptografar nova senha.' });

        const updateQuery = 'UPDATE usuarios SET senha = ? WHERE id = ?';
        db.query(updateQuery, [novaHash, id], (err, result) => {
          if (err) return res.status(500).json({ error: 'Erro ao atualizar senha.' });
          res.json({ message: 'Senha atualizada com sucesso!' });
        });
      });
    });
  });
});

// ========================
// Rotas de cartões
// ========================
app.post('/api/usuarios/:id/cartoes', (req, res) => {
  const { id } = req.params;
  const { numero, nome, validade, cvv } = req.body;

  if (!numero || !nome || !validade || !cvv) return res.status(400).json({ error: 'Todos os campos do cartão são obrigatórios.' });

  const query = 'INSERT INTO cartoes (usuario_id, numero, nome, validade, cvv) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [id, numero, nome, validade, cvv], (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro ao adicionar cartão.' });
    res.status(201).json({ message: 'Cartão adicionado com sucesso!' });
  });
});

app.delete('/api/usuarios/:id/cartoes/:cartaoId', (req, res) => {
  const { id, cartaoId } = req.params;

  const query = 'DELETE FROM cartoes WHERE id = ? AND usuario_id = ?';
  db.query(query, [cartaoId, id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro ao remover cartão.' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Cartão não encontrado.' });
    res.json({ message: 'Cartão removido com sucesso!' });
  });
});

app.get('/api/usuarios/:id/cartoes', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT id, numero, nome AS titular, validade FROM cartoes WHERE usuario_id = ?';
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar cartões.' });
    res.json(results);
  });
});

// ========================
// Rotas de espaços e avaliações
// ========================
app.get('/api/espacos', (req, res) => {
  const query = `
    SELECT e.*, 
           u.nome AS dono_nome, 
           u.foto AS dono_foto,
           IFNULL(AVG(a.nota), 0) AS avaliacao_media
    FROM espacos e
    LEFT JOIN usuarios u ON e.dono_id = u.id
    LEFT JOIN avaliacoes a ON a.espaco_id = e.id
    GROUP BY e.id, u.nome, u.foto
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar espaços', details: err });
    res.json(results);
  });
});

app.get('/api/avaliacoes/:espacoId', (req, res) => {
  const { espacoId } = req.params;
  const query = `
    SELECT a.*, u.nome AS usuario_nome, u.foto AS usuario_foto
    FROM avaliacoes a
    JOIN usuarios u ON a.usuario_id = u.id
    WHERE a.espaco_id = ?
  `;
  db.query(query, [espacoId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar avaliações' });
    res.json(results);
  });
});

// POST /api/espacos - cadastrar novo espaço com múltiplas imagens e opção de compartilhamento
app.post('/api/espacos', uploadEspaco.array('imagens', 10), (req, res) => {
  let { nome, descricao, precoHora, dono_id, comodidades, compartilhavel, capacidade_max } = req.body;

  if (!nome || !precoHora || !dono_id)
    return res.status(400).json({ error: 'Nome, preço e dono são obrigatórios.' });

  const precoHoraNum = Number(precoHora);
  if (isNaN(precoHoraNum))
    return res.status(400).json({ error: 'Preço inválido' });

  // Processar comodidades
  try {
    comodidades = comodidades ? JSON.parse(comodidades) : [];
  } catch (err) {
    return res.status(400).json({ error: 'Erro ao processar comodidades' });
  }

  // Processar imagens
  const imagensPaths = req.files ? req.files.map(file => 'http://localhost:3000/' + file.path.replace(/\\/g, '/')) : [];
  const imagemPrincipal = imagensPaths[0] || '';

  // Ajustar compartilhável e capacidade
  const isCompartilhavel = compartilhavel === 'true' || compartilhavel === true;
  const capacidadeMax = isCompartilhavel ? Number(capacidade_max) || 1 : 1;

  const query = `
    INSERT INTO espacos
      (nome, descricao, precoHora, dono_id, imagem, comodidades, imagens, compartilhavel, capacidade_max, ocupacao_atual)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
  `;

  db.query(query, [
    nome,
    descricao || '',
    precoHoraNum,
    dono_id,
    imagemPrincipal,
    JSON.stringify(comodidades),
    JSON.stringify(imagensPaths),
    isCompartilhavel ? 1 : 0,
    capacidadeMax
  ], (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro ao cadastrar espaço', details: err });
    res.status(201).json({ message: 'Espaço cadastrado com sucesso!', id: result.insertId });
  });
});

// POST /api/avaliacoes - criar nova avaliação
app.post('/api/avaliacoes', (req, res) => {
  const { usuario_id, espaco_id, nota, comentario } = req.body;

  if (!usuario_id || !espaco_id || !nota) {
    return res.status(400).json({ error: 'Campos obrigatórios não preenchidos.' });
  }

  const query = 'INSERT INTO avaliacoes (usuario_id, espaco_id, nota, comentario, criado_em) VALUES (?, ?, ?, ?, NOW())';
  db.query(query, [usuario_id, espaco_id, nota, comentario], (err, result) => {
    if (err) {
      console.error('Erro ao inserir avaliação:', err);
      return res.status(500).json({ error: 'Erro ao salvar avaliação.' });
    }
    res.json({ message: 'Avaliação salva com sucesso!' });
  });
});

// POST /api/reservas - criar reserva
app.post('/api/reservas', (req, res) => {
  const { usuario_id, espaco_id, data_reserva, hora_inicio, hora_fim, preco, forma_pagamento } = req.body;

  if (!usuario_id || !espaco_id || !data_reserva || !hora_inicio || !hora_fim || !preco || !forma_pagamento) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  // 1️⃣ Busca se o espaço é compartilhável e qual é sua capacidade
  const espacoQuery = 'SELECT compartilhavel, capacidade_max FROM espacos WHERE id = ?';
  db.query(espacoQuery, [espaco_id], (err, resultsEspaco) => {
    if (err) return res.status(500).json({ error: 'Erro ao verificar espaço.' });
    if (resultsEspaco.length === 0) return res.status(404).json({ error: 'Espaço não encontrado.' });

    const espaco = resultsEspaco[0];
    const compartilhavel = !!espaco.compartilhavel;
    const capacidadeMax = espaco.capacidade_max || 1;

    // 2️⃣ Conta quantas reservas confirmadas já existem nesse horário
    const ocupacaoQuery = `
      SELECT COUNT(*) AS ocupacao
      FROM reservas
      WHERE espaco_id = ? AND data_reserva = ?
        AND NOT (hora_fim <= ? OR hora_inicio >= ?)
        AND status = 'confirmada'
    `;
    db.query(ocupacaoQuery, [espaco_id, data_reserva, hora_inicio, hora_fim], (err, resultsOcup) => {
      if (err) return res.status(500).json({ error: 'Erro ao verificar ocupação.' });

      const ocupacaoAtual = resultsOcup[0].ocupacao;

      // 3️⃣ Validação de disponibilidade
      if (!compartilhavel && ocupacaoAtual > 0) {
        return res.status(400).json({ error: 'Espaço não compartilhável já reservado nesse horário.' });
      }

      if (compartilhavel && ocupacaoAtual >= capacidadeMax) {
        return res.status(400).json({ error: 'Capacidade máxima atingida para este horário.' });
      }

      // 4️⃣ Tudo certo: insere a reserva
      const insertQuery = `
        INSERT INTO reservas
          (usuario_id, espaco_id, data_reserva, hora_inicio, hora_fim, preco, forma_pagamento, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'confirmada')
      `;
      db.query(insertQuery, [usuario_id, espaco_id, data_reserva, hora_inicio, hora_fim, preco, forma_pagamento], (err, result) => {
        if (err) {
          console.error('❌ Erro ao criar reserva:', err);
          return res.status(500).json({ error: 'Erro ao criar reserva.' });
        }
        res.status(201).json({ message: 'Reserva criada com sucesso!', id: result.insertId });
      });
    });
  });
});

// GET /api/reservas/usuario/:usuarioId - consultar reservas de um usuário
app.get('/api/reservas/usuario/:usuarioId', (req, res) => {
  const { usuarioId } = req.params;
  const query = `
    SELECT r.*, e.nome AS espaco_nome, e.imagem AS espaco_imagem
    FROM reservas r
    JOIN espacos e ON r.espaco_id = e.id
    WHERE r.usuario_id = ?
    ORDER BY r.data_reserva DESC, r.hora_inicio DESC
  `;
  db.query(query, [usuarioId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar reservas.' });
    res.json(results);
  });
});

// GET /api/espacos/:id/ocupacao?data=YYYY-MM-DD&hora_inicio=HH:MM&hora_fim=HH:MM
app.get('/api/espacos/:id/ocupacao', (req, res) => {
  const { id } = req.params;
  const { data, hora_inicio, hora_fim } = req.query;

  if (!data || !hora_inicio || !hora_fim) {
    return res.status(400).json({ error: 'Data, hora_inicio e hora_fim são obrigatórios.' });
  }

  const query = `
    SELECT COUNT(*) AS ocupacao
    FROM reservas
    WHERE espaco_id = ?
      AND data_reserva = ?
      AND NOT (hora_fim <= ? OR hora_inicio >= ?)
      AND status = 'confirmada'
  `;

  db.query(query, [id, data, hora_inicio, hora_fim], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ ocupacao: results[0].ocupacao });
  });
});

// GET /api/reservas/ocupacao/:espacoId?data=YYYY-MM-DD&hora_inicio=HH:MM&hora_fim=HH:MM
app.get('/api/reservas/ocupacao/:espacoId', (req, res) => {
  const { espacoId } = req.params;
  const { data, hora_inicio, hora_fim } = req.query;

  if (!data || !hora_inicio || !hora_fim) {
    return res.status(400).json({ error: 'Data, hora_inicio e hora_fim são obrigatórios.' });
  }

  const sql = `
    SELECT COUNT(*) AS ocupacao
    FROM reservas
    WHERE espaco_id = ?
      AND data_reserva = ?
      AND NOT (hora_fim <= ? OR hora_inicio >= ?)
      AND status = 'confirmada'
  `;

  db.query(sql, [espacoId, data, hora_inicio, hora_fim, hora_inicio, hora_fim], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar ocupação.' });
    res.json({ ocupacao: results[0].ocupacao });
  });
});

// Buscar reservas de um usuário (com dados do espaço)
app.get('/api/reservas/usuario/:id', (req, res) => {
  const usuarioId = req.params.id;
  const sql = `
    SELECT 
      e.nome
      r.id,
      r.usuario_id,
      r.espaco_id,
      r.data_reserva,
      r.hora_inicio,
      r.hora_fim,
      r.preco,
      r.status,
    FROM reservas r
    JOIN espacos e ON r.espaco_id = e.id
    WHERE r.usuario_id = ?
    ORDER BY r.data_reserva DESC
  `;
  db.query(sql, [usuarioId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});


// PUT /api/reservas/:id/status - Atualiza o status da reserva
app.put('/api/reservas/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'O campo status é obrigatório.' });
  }

  const query = 'UPDATE reservas SET status = ?, atualizado_em = NOW() WHERE id = ?';

  db.query(query, [status, id], (err, result) => {
    if (err) {
      console.error('❌ Erro ao atualizar status da reserva:', err);
      return res.status(500).json({ error: 'Erro ao atualizar status da reserva.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Reserva não encontrada.' });
    }

    console.log(`✅ Reserva ${id} atualizada para status: ${status}`);
    res.json({ message: 'Status atualizado com sucesso!' });
  });
});

app.put('/api/usuarios/redefinir-senha', (req, res) => {
  const { email, novaSenha } = req.body;
  if (!email || !novaSenha) return res.status(400).json({ error: 'Dados incompletos.' });

  const sql = 'UPDATE usuarios SET senha = ? WHERE email = ?';
  db.query(sql, [novaSenhaHash, email], (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro no servidor.' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuário não encontrado.' });
    res.json({ message: 'Senha atualizada com sucesso.' });
  });
});

// ========================
// Inicialização do servidor
// ========================
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando em http://localhost:${PORT}`));
