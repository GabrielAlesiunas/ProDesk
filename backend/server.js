const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');

const app = express();
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
  if (err) {
    console.error('Erro ao conectar:', err);
  } else {
    console.log('✅ Conectado ao MySQL!');
  }
});

// Configuração multer para uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, 'usuario_' + req.params.id + ext);
  }
});
const upload = multer({ storage });

// ========================
// Rotas de autenticação
// ========================

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
const SALT_ROUNDS = 10;
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

// GET /api/usuarios/:id
app.get('/api/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT id, nome, email, telefone, endereco, foto FROM usuarios WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar usuário' });
    if (results.length === 0) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(results[0]);
  });
});

// PUT /api/usuarios/:id
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

// PUT /api/usuarios/:id/foto
app.put('/api/usuarios/:id/foto', upload.single('foto'), (req, res) => {
  const { id } = req.params;
  if (!req.file) return res.status(400).json({ error: 'Arquivo não enviado' });

  const fotoPath = 'http://localhost:3000/' + req.file.path.replace(/\\/g, '/'); // URL pública
  const query = 'UPDATE usuarios SET foto = ? WHERE id = ?';
  db.query(query, [fotoPath, id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro ao atualizar foto' });
    res.json({ message: 'Foto atualizada com sucesso!', foto: fotoPath });
  });
});

// PUT /api/usuarios/:id/senha
app.put('/api/usuarios/:id/senha', (req, res) => {
  const { id } = req.params;
  const { senhaAtual, novaSenha } = req.body;

  if (!senhaAtual || !novaSenha) {
    return res.status(400).json({ error: 'Informe a senha atual e a nova senha.' });
  }

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

// POST /api/usuarios/:id/cartoes
app.post('/api/usuarios/:id/cartoes', (req, res) => {
  const { id } = req.params;
  const { numero, nome, validade, cvv } = req.body;

  if (!numero || !nome || !validade || !cvv) {
    return res.status(400).json({ error: 'Todos os campos do cartão são obrigatórios.' });
  }

  const query = 'INSERT INTO cartoes (usuario_id, numero, nome, validade, cvv) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [id, numero, nome, validade, cvv], (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro ao adicionar cartão.' });
    res.status(201).json({ message: 'Cartão adicionado com sucesso!' });
  });
});

// DELETE /api/usuarios/:id/cartoes/:cartaoId
app.delete('/api/usuarios/:id/cartoes/:cartaoId', (req, res) => {
  const { id, cartaoId } = req.params;

  const query = 'DELETE FROM cartoes WHERE id = ? AND usuario_id = ?';
  db.query(query, [cartaoId, id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro ao remover cartão.' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Cartão não encontrado.' });
    res.json({ message: 'Cartão removido com sucesso!' });
  });
});

// GET /api/usuarios/:id/cartoes
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

// GET /api/espacos
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

// GET /api/avaliacoes/:espacoId
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

// ========================
// Inicialização do servidor
// ========================
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando em http://localhost:${PORT}`));