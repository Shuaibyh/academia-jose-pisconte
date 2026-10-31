CREATE TABLE lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(160) NOT NULL,
    description TEXT NOT NULL,
    video_url TEXT NOT NULL,
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
    sequence INTEGER NOT NULL CHECK (sequence > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (course_id, sequence)
);

CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(160) NOT NULL,
    instructions TEXT NOT NULL,
    due_date DATE NOT NULL,
    max_score INTEGER NOT NULL CHECK (max_score > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    artifact_type VARCHAR(30) NOT NULL,
    artifact_url TEXT NOT NULL,
    student_comment TEXT NOT NULL,
    ai_feedback TEXT NOT NULL,
    score INTEGER NOT NULL CHECK (score >= 0),
    status VARCHAR(30) NOT NULL,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (assignment_id, student_id)
);

INSERT INTO lessons (course_id, title, description, video_url, duration_minutes, sequence)
SELECT id, 'Clase 1: Fundamentos del curso', 'Video de prueba para validar la experiencia de aula virtual en tablets.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 42, 1
FROM courses
WHERE code = 'MAT-101';

INSERT INTO lessons (course_id, title, description, video_url, duration_minutes, sequence)
SELECT id, 'Clase 2: Resolucion guiada', 'Sesion grabada con ejercicios y recomendaciones para el estudiante.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 55, 2
FROM courses
WHERE code = 'MAT-101';

INSERT INTO lessons (course_id, title, description, video_url, duration_minutes, sequence)
SELECT id, 'Clase 1: Lectura critica', 'Clase introductoria enfocada en comprension y analisis de textos.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 38, 1
FROM courses
WHERE code = 'COM-201';

INSERT INTO assignments (course_id, title, instructions, due_date, max_score)
SELECT id, 'Practica de ecuaciones', 'Sube foto o video resolviendo cinco ejercicios. La IA demo revisara claridad, procedimiento y resultado.', CURRENT_DATE + 7, 20
FROM courses
WHERE code = 'MAT-101';

INSERT INTO assignments (course_id, title, instructions, due_date, max_score)
SELECT id, 'Comentario de texto', 'Envia una foto o archivo con tu comentario academico. La IA demo dara observaciones iniciales.', CURRENT_DATE + 10, 20
FROM courses
WHERE code = 'COM-201';
