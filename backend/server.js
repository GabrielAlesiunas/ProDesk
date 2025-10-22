const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

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

// POST /api/login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
  }

  const query = 'SELECT * FROM usuarios WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Erro ao buscar usuário:', err);
      return res.status(500).json({ error: 'Erro no servidor.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    const usuario = results[0];

    // Comparar senha com bcrypt
    const bcrypt = require('bcrypt');
    bcrypt.compare(password, usuario.senha, (err, match) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao verificar senha.' });
      }

      if (!match) {
        return res.status(401).json({ error: 'Senha incorreta.' });
      }

      // Login bem-sucedido
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
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

app.post('/api/usuarios', (req, res) => {
  const { name, email, cpf, password } = req.body;

  if (!name || !email || !cpf || !password) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  // Verifica se o e-mail ou CPF já existem
  const checkQuery = 'SELECT * FROM usuarios WHERE email = ? OR cpf = ?';
  db.query(checkQuery, [email, cpf], (err, results) => {
    if (err) {
      console.error('Erro ao verificar usuário:', err);
      return res.status(500).json({ error: 'Erro ao verificar usuário.' });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: 'Usuário já cadastrado com este e-mail ou CPF.' });
    }

    // Criptografa a senha antes de inserir
    bcrypt.hash(password, SALT_ROUNDS, (err, hash) => {
      if (err) {
        console.error('Erro ao criptografar senha:', err);
        return res.status(500).json({ error: 'Erro ao processar senha.' });
      }

      // Insere o novo usuário com a senha criptografada
      const insertQuery = 'INSERT INTO usuarios (nome, email, cpf, senha) VALUES (?, ?, ?, ?)';
      db.query(insertQuery, [name, email, cpf, hash], (err, result) => {
        if (err) {
          console.error('Erro ao inserir usuário:', err);
          return res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
        }

        res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
      });
    });
  });
});

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

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando em http://localhost:${PORT}`));
