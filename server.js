const express = require('express');
const app = express();
const http = require('http').createServer(app);
const path = require('path');
const bodyParser = require('body-parser');
const io = require('socket.io')(http);
const { obtenerPreguntasAleatorias, agregarPregunta } = require('./db');

const PORT = process.env.PORT || 3000;

// Middlewares
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Página principal (moderador)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/moderador.html'));
});

// Página pública
app.get('/pantalla', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pantalla.html'));
});

// Página para agregar preguntas
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/admin.html'));
});

// Ruta para guardar una nueva pregunta
app.post('/agregar-pregunta', (req, res) => {
  agregarPregunta(req.body, (err, id) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error al guardar la pregunta.');
    }
    res.send('Pregunta guardada correctamente.');
  });
});

// Ruta para obtener preguntas aleatorias por dificultad (ejemplo: 2 fáciles, 2 medias, 1 difícil)
app.get('/preguntas-aleatorias', async (req, res) => {
  try {
    const preguntas = await obtenerPreguntasAleatorias({
      facil: 2,
      media: 2,
      dificil: 1
    });
    res.json(preguntas);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener preguntas');
  }
});

// WebSockets para comunicación en tiempo real
io.on('connection', socket => {
  console.log('🔌 Cliente conectado');

  socket.on('mostrar-pregunta', data => {
    io.emit('pregunta-mostrar', data);
  });

  socket.on('respuesta', data => {
    io.emit('respuesta-resultado', data);
  });

  socket.on('actualizar-puntaje', data => {
    io.emit('puntaje-actualizado', data);
  });

  socket.on('reset', () => {
    io.emit('reset');
  });
});

http.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
