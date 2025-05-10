CREATE TABLE IF NO EXISTS preguntas (
    id BIGINT PRIMARY KEY AUTOINCREMENT,
    pregunta TEXT NOT NULL,
    opicones TEXT NOT NULL,
    respuesta_correcta TEXT NOT NULL,
    puntuacion INTEGER NOT NULL,
    area TEXT NOT NULL,
    dificultad TEXT NOT NULL,
    tiempo_segundos INTEGER NOT NULL
)