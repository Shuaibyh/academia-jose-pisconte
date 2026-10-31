CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(140) NOT NULL,
    body TEXT NOT NULL,
    category VARCHAR(30) NOT NULL,
    audience VARCHAR(30) NOT NULL,
    created_by VARCHAR(160) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE attendance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    class_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL,
    remarks VARCHAR(220),
    marked_by VARCHAR(160) NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (student_id, course_id, class_date)
);

CREATE TABLE practice_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    practice_name VARCHAR(120) NOT NULL,
    score NUMERIC(5,2) NOT NULL CHECK (score >= 0),
    max_score NUMERIC(5,2) NOT NULL CHECK (max_score > 0),
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO announcements (title, body, category, audience, created_by)
VALUES
    ('Completar ficha academica', 'Recuerda actualizar tus datos para mantener activo tu acceso al aula virtual y a las clases grabadas.', 'COMUNICADO', 'STUDENT', 'Coordinacion Academica'),
    ('Entrega de practicas semanal', 'Las practicas se reciben hasta el domingo. Adjunta foto, video o PDF segun indique el docente.', 'ANUNCIO', 'STUDENT', 'Ana Flores'),
    ('Revision de asistencias', 'Docentes: verificar la asistencia del dia antes de cerrar el reporte academico.', 'COMUNICADO', 'TEACHER', 'Coordinacion Academica');

INSERT INTO practice_scores (student_id, course_id, practice_name, score, max_score)
SELECT s.id, c.id, 'Practica 1', 16, 20
FROM students s
JOIN courses c ON c.code = 'MAT-101'
WHERE s.document_number = 'DNI-1001';

INSERT INTO practice_scores (student_id, course_id, practice_name, score, max_score)
SELECT s.id, c.id, 'Practica 2', 18, 20
FROM students s
JOIN courses c ON c.code = 'MAT-101'
WHERE s.document_number = 'DNI-1001';

INSERT INTO practice_scores (student_id, course_id, practice_name, score, max_score)
SELECT s.id, c.id, 'Practica 1', 17, 20
FROM students s
JOIN courses c ON c.code = 'PRO-110'
WHERE s.document_number = 'DNI-1001';

INSERT INTO attendance_records (student_id, course_id, class_date, status, remarks, marked_by)
SELECT s.id, c.id, CURRENT_DATE, 'PRESENT', 'Marcado en demo inicial', 'Sistema'
FROM students s
JOIN enrollments e ON e.student_id = s.id
JOIN courses c ON c.id = e.course_id
WHERE s.document_number = 'DNI-1001';
