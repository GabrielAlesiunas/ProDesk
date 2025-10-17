// server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Conexão MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'prodesk'
});

db.connect(err => {
  if (err) console.log('Erro no MySQL:', err);
  else console.log('Conectado ao MySQL');
});

// Rota cadastro
app.post('/register', (req, res) => {
  const { nome, email, cpf, senha, tipo } = req.body;
  db.query(
    'INSERT INTO usuarios (nome, email, cpf, senha, tipo) VALUES (?, ?, ?, ?, ?)',
    [nome, email, cpf, senha, tipo],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Cadastro realizado com sucesso!' });
    }
  );
});

// Rota login
app.post('/login', (req, res) => {
  const { email, senha, tipo } = req.body;
  db.query(
    'SELECT * FROM usuarios WHERE email=? AND senha=? AND tipo=?',
    [email, senha, tipo],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (results.length === 0) return res.status(401).json({ message: 'Usuário ou senha inválidos' });
      res.json({ user: results[0] });
    }
  );
});

// Rota para listar espaços (apenas exemplo)
app.get('/espacos', (req, res) => {
  db.query('SELECT * FROM espacos', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
