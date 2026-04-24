ALTER TABLE IF EXISTS "user"
	ADD COLUMN IF NOT EXISTS school_id INTEGER;

ALTER TABLE IF EXISTS classroom
	ADD COLUMN IF NOT EXISTS school_id INTEGER;

DO $$
BEGIN
	IF EXISTS (
		SELECT 1 FROM information_schema.columns
		WHERE table_schema = 'public' AND table_name = 'user' AND column_name = 'school_id'
	) THEN
		EXECUTE 'CREATE INDEX IF NOT EXISTS idx_user_school_id ON "user" (school_id)';
	END IF;

	IF EXISTS (
		SELECT 1 FROM information_schema.columns
		WHERE table_schema = 'public' AND table_name = 'classroom' AND column_name = 'school_id'
	) THEN
		EXECUTE 'CREATE INDEX IF NOT EXISTS idx_classroom_school_id ON classroom (school_id)';
	END IF;

	IF EXISTS (
		SELECT 1 FROM information_schema.columns
		WHERE table_schema = 'public' AND table_name = 'classroom_membership' AND column_name = 'user_id'
	) THEN
		EXECUTE 'CREATE INDEX IF NOT EXISTS idx_classroom_membership_user_id ON classroom_membership (user_id)';
	END IF;

	IF EXISTS (
		SELECT 1 FROM information_schema.columns
		WHERE table_schema = 'public' AND table_name = 'class_session' AND column_name = 'classroom_id'
	) THEN
		EXECUTE 'CREATE INDEX IF NOT EXISTS idx_class_session_classroom_id ON class_session (classroom_id)';
	END IF;

	IF EXISTS (
		SELECT 1 FROM information_schema.columns
		WHERE table_schema = 'public' AND table_name = 'attendance' AND column_name = 'student_id'
	) THEN
		EXECUTE 'CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON attendance (student_id)';
	END IF;

	IF EXISTS (
		SELECT 1 FROM information_schema.columns
		WHERE table_schema = 'public' AND table_name = 'attendance' AND column_name = 'session_id'
	) THEN
		EXECUTE 'CREATE INDEX IF NOT EXISTS idx_attendance_session_id ON attendance (session_id)';
	END IF;

	IF EXISTS (
		SELECT 1 FROM information_schema.columns
		WHERE table_schema = 'public' AND table_name = 'assignment' AND column_name = 'classroom_id'
	) THEN
		EXECUTE 'CREATE INDEX IF NOT EXISTS idx_assignment_classroom_id ON assignment (classroom_id)';
	END IF;

	IF EXISTS (
		SELECT 1 FROM information_schema.columns
		WHERE table_schema = 'public' AND table_name = 'assignment_submission' AND column_name = 'user_id'
	) THEN
		EXECUTE 'CREATE INDEX IF NOT EXISTS idx_assignment_submission_user_id ON assignment_submission (user_id)';
	END IF;
END $$;