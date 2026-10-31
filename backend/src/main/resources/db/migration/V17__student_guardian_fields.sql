ALTER TABLE students
ADD COLUMN guardian_name VARCHAR(120),
ADD COLUMN guardian_phone VARCHAR(40),
ADD COLUMN guardian_relationship VARCHAR(60);

UPDATE students
SET guardian_name = 'Apoderado pendiente',
    guardian_phone = 'Pendiente',
    guardian_relationship = 'Apoderado'
WHERE guardian_name IS NULL;
