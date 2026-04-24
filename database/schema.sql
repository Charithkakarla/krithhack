CREATE TABLE IF NOT EXISTS "user" (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'parent')),
    school_id INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS parent_student_link (
    id SERIAL PRIMARY KEY,
    parent_id INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    student_id INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    UNIQUE (parent_id, student_id)
);

CREATE TABLE IF NOT EXISTS classroom (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    school_id INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS classroom_membership (
    id SERIAL PRIMARY KEY,
    classroom_id INTEGER NOT NULL REFERENCES classroom(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role = 'student'),
    UNIQUE (classroom_id, user_id)
);

CREATE TABLE IF NOT EXISTS class_session (
    id SERIAL PRIMARY KEY,
    classroom_id INTEGER NOT NULL REFERENCES classroom(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    topic VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS attendance (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    session_id INTEGER NOT NULL REFERENCES class_session(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('PRESENT', 'ABSENT', 'LATE')),
    UNIQUE (student_id, session_id)
);

CREATE TABLE IF NOT EXISTS assignment (
    id SERIAL PRIMARY KEY,
    classroom_id INTEGER NOT NULL REFERENCES classroom(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS assignment_submission (
    id SERIAL PRIMARY KEY,
    assignment_id INTEGER NOT NULL REFERENCES assignment(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    score DOUBLE PRECISION NOT NULL,
    total DOUBLE PRECISION NOT NULL,
    percentage DOUBLE PRECISION NOT NULL
);

-- Migration-safe additions for existing tables that were created earlier without school_id.
ALTER TABLE "user"
    ADD COLUMN IF NOT EXISTS school_id INTEGER;

ALTER TABLE classroom
    ADD COLUMN IF NOT EXISTS school_id INTEGER;

CREATE INDEX IF NOT EXISTS idx_user_school_id ON "user" (school_id);
CREATE INDEX IF NOT EXISTS idx_classroom_school_id ON classroom (school_id);
CREATE INDEX IF NOT EXISTS idx_classroom_membership_user_id ON classroom_membership (user_id);
CREATE INDEX IF NOT EXISTS idx_class_session_classroom_id ON class_session (classroom_id);
CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON attendance (student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_session_id ON attendance (session_id);
CREATE INDEX IF NOT EXISTS idx_assignment_classroom_id ON assignment (classroom_id);
CREATE INDEX IF NOT EXISTS idx_assignment_submission_user_id ON assignment_submission (user_id);
ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;