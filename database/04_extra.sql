-- Optional extension tables for production operations.
-- These are additive and do not replace hackathon-required core tables.

CREATE TABLE IF NOT EXISTS notification_log (
    id BIGSERIAL PRIMARY KEY,
    school_id INTEGER,
    user_id INTEGER REFERENCES "user"(id) ON DELETE SET NULL,
    channel VARCHAR(30) NOT NULL DEFAULT 'whatsapp',
    recipient VARCHAR(255) NOT NULL,
    template_name VARCHAR(120),
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    provider_message_id VARCHAR(255),
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sent_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS audit_log (
    id BIGSERIAL PRIMARY KEY,
    actor_user_id INTEGER REFERENCES "user"(id) ON DELETE SET NULL,
    action VARCHAR(120) NOT NULL,
    entity_type VARCHAR(120) NOT NULL,
    entity_id VARCHAR(120),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    ip_address VARCHAR(64),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS documents (
    id BIGSERIAL PRIMARY KEY,
    school_id INTEGER,
    student_id INTEGER REFERENCES "user"(id) ON DELETE SET NULL,
    uploaded_by INTEGER REFERENCES "user"(id) ON DELETE SET NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT,
    mime_type VARCHAR(120),
    extracted_text TEXT,
    ocr_confidence DOUBLE PRECISION,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_insight_history (
    id BIGSERIAL PRIMARY KEY,
    school_id INTEGER,
    student_id INTEGER REFERENCES "user"(id) ON DELETE CASCADE,
    model_name VARCHAR(120) NOT NULL,
    input_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_summary TEXT NOT NULL,
    strengths JSONB NOT NULL DEFAULT '[]'::jsonb,
    weaknesses JSONB NOT NULL DEFAULT '[]'::jsonb,
    recommendation TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS report_export (
    id BIGSERIAL PRIMARY KEY,
    school_id INTEGER,
    student_id INTEGER REFERENCES "user"(id) ON DELETE CASCADE,
    report_type VARCHAR(80) NOT NULL,
    period_start DATE,
    period_end DATE,
    pdf_url TEXT,
    graph_urls JSONB NOT NULL DEFAULT '[]'::jsonb,
    status VARCHAR(30) NOT NULL DEFAULT 'GENERATED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tests (
    id BIGSERIAL PRIMARY KEY,
    school_id INTEGER,
    classroom_id INTEGER REFERENCES classroom(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    questions JSONB NOT NULL,
    answer_key JSONB NOT NULL,
    created_by INTEGER REFERENCES "user"(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS test_attempt (
    id BIGSERIAL PRIMARY KEY,
    test_id BIGINT NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
    student_id INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    selected_answers JSONB NOT NULL DEFAULT '[]'::jsonb,
    score DOUBLE PRECISION,
    total DOUBLE PRECISION,
    percentage DOUBLE PRECISION,
    duration_seconds INTEGER,
    submitted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (test_id, student_id, created_at)
);

CREATE TABLE IF NOT EXISTS scheduler_job_run (
    id BIGSERIAL PRIMARY KEY,
    job_name VARCHAR(120) NOT NULL,
    trigger_type VARCHAR(50) NOT NULL,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    finished_at TIMESTAMPTZ,
    status VARCHAR(30) NOT NULL DEFAULT 'RUNNING',
    success_count INTEGER NOT NULL DEFAULT 0,
    failure_count INTEGER NOT NULL DEFAULT 0,
    error_message TEXT
);

CREATE TABLE IF NOT EXISTS guardian_access_request (
    id BIGSERIAL PRIMARY KEY,
    parent_id INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    student_id INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    verification_method VARCHAR(50) NOT NULL DEFAULT 'child_credentials',
    verified_at TIMESTAMPTZ,
    reviewed_by INTEGER REFERENCES "user"(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (parent_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_notification_log_user_id ON notification_log(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_log_status ON notification_log(status);
CREATE INDEX IF NOT EXISTS idx_audit_log_actor_user_id ON audit_log(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_documents_student_id ON documents(student_id);
CREATE INDEX IF NOT EXISTS idx_ai_insight_history_student_id ON ai_insight_history(student_id);
CREATE INDEX IF NOT EXISTS idx_report_export_student_id ON report_export(student_id);
CREATE INDEX IF NOT EXISTS idx_test_attempt_test_id ON test_attempt(test_id);
CREATE INDEX IF NOT EXISTS idx_test_attempt_student_id ON test_attempt(student_id);
CREATE INDEX IF NOT EXISTS idx_scheduler_job_run_job_name ON scheduler_job_run(job_name);
CREATE INDEX IF NOT EXISTS idx_guardian_access_request_parent_id ON guardian_access_request(parent_id);
