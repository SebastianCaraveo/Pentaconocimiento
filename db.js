const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('preguntas.db');

// Crear la tabla si no existe
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS preguntas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pregunta TEXT NOT NULL,
      respuesta TEXT NOT NULL,
      puntos INTEGER NOT NULL,
      area TEXT NOT NULL,
      dificultad TEXT NOT NULL,
      tiempo INTEGER NOT NULL
    )
  `);
});

// Agregar una nueva pregunta
function agregarPregunta(data, callback) {
  const { pregunta, respuesta, puntos, area, dificultad, tiempo } = data;
  const stmt = db.prepare(`
    INSERT INTO preguntas (pregunta, respuesta, puntos, area, dificultad, tiempo)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  stmt.run(pregunta, respuesta, puntos, area, dificultad, tiempo, function(err) {
    if (err) {
      callback(err);
    } else {
      callback(null, this.lastID);
    }
  });
  stmt.finalize();
}

// Obtener preguntas aleatorias por dificultad
function obtenerPreguntasAleatorias(cantidadPorDificultad = { facil: 2, media: 2, dificil: 1 }) {
  return new Promise((resolve, reject) => {
    const dificultades = Object.keys(cantidadPorDificultad);
    const promesas = dificultades.map(dificultad => {
      return new Promise((res, rej) => {
        db.all(
          `SELECT * FROM preguntas WHERE dificultad = ? ORDER BY RANDOM() LIMIT ?`,
          [dificultad, cantidadPorDificultad[dificultad]],
          (err, rows) => {
            if (err) return rej(err);
            res(rows);
          }
        );
      });
    });

    Promise.all(promesas)
      .then(resultados => {
        const todas = resultados.flat();
        resolve(todas);
      })
      .catch(err => reject(err));
  });
}

module.exports = {
  agregarPregunta,
  obtenerPreguntasAleatorias
};
