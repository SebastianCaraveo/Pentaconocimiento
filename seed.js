// seed.js
const { agregarPregunta } = require('./bd');

const preguntas = [
  {
    pregunta: '¿Cuál es la raíz cuadrada de 144?',
    respuesta: '12',
    puntos: 10,
    area: 'Matemáticas',
    dificultad: 'fácil',
    tiempo: 30
  },
  {
    pregunta: '¿Quién formuló la Ley de la Gravitación Universal?',
    respuesta: 'Isaac Newton',
    puntos: 15,
    area: 'Física',
    dificultad: 'media',
    tiempo: 45
  },
  {
    pregunta: '¿Qué valor tiene el número pi aproximado a 3 decimales?',
    respuesta: '3.141',
    puntos: 10,
    area: 'Matemáticas',
    dificultad: 'fácil',
    tiempo: 30
  }
];

preguntas.forEach((pregunta) => {
  agregarPregunta(pregunta, (err, id) => {
    if (err) console.error('Error:', err);
    else console.log(`Pregunta insertada con ID: ${id}`);
  });
});
