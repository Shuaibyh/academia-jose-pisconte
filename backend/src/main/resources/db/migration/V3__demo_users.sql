CREATE TABLE app_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(160) NOT NULL UNIQUE,
    password VARCHAR(120) NOT NULL,
    display_name VARCHAR(160) NOT NULL,
    role VARCHAR(30) NOT NULL,
    student_id UUID REFERENCES students(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO app_users (email, password, display_name, role, student_id)
SELECT 'estudiante@josepisconte.test', '${demo-student-password}', first_name || ' ' || last_name, 'STUDENT', id
FROM students
WHERE document_number = 'DNI-1001';

INSERT INTO app_users (email, password, display_name, role)
VALUES
    ('profesor@josepisconte.test', '${demo-admin-password}', 'Docente Demo', 'TEACHER'),
    ('admin@josepisconte.test', '${demo-admin-password}', 'Coordinacion Academica', 'ADMIN');
