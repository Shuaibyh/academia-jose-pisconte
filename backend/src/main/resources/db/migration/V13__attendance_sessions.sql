CREATE TABLE attendance_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(120) NOT NULL,
    session_date DATE NOT NULL,
    week_number INTEGER NOT NULL CHECK (week_number > 0),
    created_by VARCHAR(160) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (course_id, session_date)
);

ALTER TABLE attendance_records
ADD COLUMN session_id UUID REFERENCES attendance_sessions(id) ON DELETE SET NULL;

INSERT INTO enrollments (student_id, course_id, status)
SELECT app_users.student_id, courses.id, 'ACTIVE'
FROM app_users
CROSS JOIN courses
WHERE app_users.role = 'STUDENT'
  AND app_users.student_id IS NOT NULL
ON CONFLICT (student_id, course_id) DO NOTHING;
