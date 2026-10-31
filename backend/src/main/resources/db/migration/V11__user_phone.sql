ALTER TABLE app_users
ADD COLUMN phone VARCHAR(30);

UPDATE app_users
SET phone = CASE
    WHEN username = 'estudiante' THEN 'Pendiente'
    WHEN username = 'docente' THEN 'Pendiente'
    WHEN username = 'shuaiby' THEN 'Pendiente'
    ELSE phone
END;
