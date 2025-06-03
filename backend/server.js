const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// LOGIN
app.post('/login', (req, res) => {
  const { email } = req.body;
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error en la DB' });
    if (results.length > 0) {
      res.json({ id: results[0].id });
    } else {
      db.query('INSERT INTO users (email, puntos) VALUES (?, 0)', [email], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al crear usuario' });
        res.json({ id: result.insertId });
      });
    }
  });
});

// OBTENER USUARIO
app.get('/users/:id', (req, res) => {
  db.query('SELECT * FROM users WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener usuario' });
    res.json(results[0]);
  });
});

// ACTUALIZAR PUNTAJE
app.put('/users/:id', (req, res) => {
  const { puntos } = req.body;
  db.query('UPDATE users SET puntos = ? WHERE id = ?', [puntos, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Error al actualizar' });
    res.json({ message: 'Actualizado' });
  });
});

// GUARDAR RESPUESTA DE TRIVIA
app.post('/respuestas', (req, res) => {
  const { user_id, pregunta, respuesta, es_correcta } = req.body;
  db.query(
    'INSERT INTO respuestas (user_id, pregunta, respuesta, es_correcta) VALUES (?, ?, ?, ?)',
    [user_id, pregunta, respuesta, es_correcta],
    (err) => {
      if (err) return res.status(500).json({ error: 'Error al guardar respuesta' });
      res.json({ message: 'Respuesta guardada' });
    }
  );
});

app.listen(process.env.PORT, () => {
  console.log(`API corriendo en el puerto ${process.env.PORT}`);
});