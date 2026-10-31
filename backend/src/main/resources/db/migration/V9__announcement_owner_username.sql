ALTER TABLE announcements
ADD COLUMN created_by_username VARCHAR(60);

UPDATE announcements
SET created_by_username = CASE
    WHEN created_by = 'Ana Flores' THEN 'docente'
    WHEN created_by = 'Shuaiby' THEN 'shuaiby'
    ELSE 'sistema'
END;

ALTER TABLE announcements
ALTER COLUMN created_by_username SET NOT NULL;
