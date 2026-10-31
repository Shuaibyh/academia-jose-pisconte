ALTER TABLE students
ADD COLUMN second_guardian_name VARCHAR(120),
ADD COLUMN second_guardian_phone VARCHAR(40),
ADD COLUMN second_guardian_relationship VARCHAR(60);

INSERT INTO students (
    first_name,
    last_name,
    email,
    document_number,
    guardian_name,
    guardian_phone,
    guardian_relationship,
    second_guardian_name,
    second_guardian_phone,
    second_guardian_relationship
)
VALUES (
    'Estudiante',
    'Demo Dos',
    'estudiante2@example.invalid',
    'EST-0002',
    'Apoderado Demo Uno',
    'Pendiente',
    'Madre',
    'Apoderado Demo Dos',
    'Pendiente',
    'Padre'
)
ON CONFLICT (document_number) DO NOTHING;

INSERT INTO app_users (email, password, display_name, role, student_id, username, phone)
SELECT
    'estudiante2@example.invalid',
    '${demo-student-password}',
    first_name || ' ' || last_name,
    'STUDENT',
    id,
    'estudiante2',
    'Pendiente'
FROM students
WHERE document_number = 'EST-0002'
ON CONFLICT (username) DO NOTHING;
