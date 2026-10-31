ALTER TABLE assignments
ADD COLUMN start_at TIMESTAMP,
ADD COLUMN end_at TIMESTAMP;

UPDATE assignments
SET start_at = due_date::timestamp,
    end_at = due_date::timestamp + interval '23 hours 59 minutes 59 seconds'
WHERE start_at IS NULL OR end_at IS NULL;

ALTER TABLE assignments
ALTER COLUMN start_at SET NOT NULL,
ALTER COLUMN end_at SET NOT NULL;
