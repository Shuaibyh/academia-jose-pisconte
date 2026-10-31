ALTER TABLE app_users
ADD COLUMN username VARCHAR(60);

UPDATE app_users
SET username = CASE
    WHEN email = 'estudiante@josepisconte.test' THEN 'estudiante'
    WHEN email = 'profesor@josepisconte.test' THEN 'docente'
    WHEN email = 'programador@josepisconte.test' THEN 'shuaiby'
    ELSE lower(split_part(email, '@', 1))
END;

UPDATE app_users
SET display_name = 'Shuaiby'
WHERE email = 'programador@josepisconte.test';

ALTER TABLE app_users
ALTER COLUMN username SET NOT NULL;

ALTER TABLE app_users
ADD CONSTRAINT uk_app_users_username UNIQUE (username);
