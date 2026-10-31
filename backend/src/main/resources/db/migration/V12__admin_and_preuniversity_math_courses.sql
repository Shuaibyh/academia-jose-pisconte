UPDATE app_users
SET role = 'ADMIN',
    display_name = 'Shuaiby'
WHERE username = 'shuaiby';

DELETE FROM submissions
WHERE assignment_id IN (
    SELECT assignments.id
    FROM assignments
    JOIN courses ON courses.id = assignments.course_id
);

DELETE FROM practice_scores
WHERE course_id IN (SELECT id FROM courses);

DELETE FROM attendance_records
WHERE course_id IN (SELECT id FROM courses);

DELETE FROM enrollments
WHERE course_id IN (SELECT id FROM courses);

DELETE FROM assignments
WHERE course_id IN (SELECT id FROM courses);

DELETE FROM lessons
WHERE course_id IN (SELECT id FROM courses);

DELETE FROM courses;

INSERT INTO courses (code, name, credits, teacher)
VALUES
    ('ARI-001', 'Aritmetica Preuniversitaria', 4, 'Academia Jose Pisconte'),
    ('ALG-001', 'Algebra Preuniversitaria', 4, 'Academia Jose Pisconte'),
    ('GEO-001', 'Geometria Preuniversitaria', 4, 'Academia Jose Pisconte'),
    ('TRI-001', 'Trigonometria Preuniversitaria', 4, 'Academia Jose Pisconte'),
    ('RM-001', 'Razonamiento Matematico', 4, 'Academia Jose Pisconte');

INSERT INTO lessons (course_id, title, description, video_url, duration_minutes, sequence)
SELECT id, 'Clase 1: Introduccion y diagnostico', 'Clase inicial para reconocer el nivel del estudiante y explicar la ruta de aprendizaje.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 45, 1
FROM courses;

INSERT INTO lessons (course_id, title, description, video_url, duration_minutes, sequence)
SELECT id, 'Clase 2: Ejercicios tipo admision', 'Resolucion guiada de problemas frecuentes en examenes preuniversitarios del Peru.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 55, 2
FROM courses;

INSERT INTO assignments (course_id, title, instructions, due_date, max_score)
SELECT id, 'Practica semanal - ' || name, 'Sube foto, video o PDF con tus procedimientos. La IA demo dara una primera revision y el docente podra validar.', CURRENT_DATE + 7, 20
FROM courses;
