UPDATE app_users
SET role = 'ADMIN',
    display_name = 'Shuaiby'
WHERE username = 'shuaiby';

UPDATE app_users
SET role = 'STUDENT'
WHERE username = 'estudiante';

DELETE FROM app_users
WHERE username NOT IN ('shuaiby', 'estudiante');

UPDATE announcements
SET audience = 'ALL'
WHERE audience IN ('TEACHER', 'HEAD_TEACHER', 'ADMIN');

UPDATE announcements
SET created_by = 'Shuaiby',
    created_by_username = 'shuaiby'
WHERE created_by_username IN ('docente', 'admin');
