from sqlalchemy import text


def attendance_query() -> str:
    return """
    SELECT
        a.student_id,
        COUNT(*) FILTER (WHERE a.status = 'PRESENT') AS present_count,
        COUNT(*) FILTER (WHERE a.status = 'LATE') AS late_count,
        COUNT(*) AS total_sessions,
        ROUND(
            ((COUNT(*) FILTER (WHERE a.status IN ('PRESENT', 'LATE')))::numeric / NULLIF(COUNT(*), 0)) * 100,
            2
        ) AS overall_attendance_percentage
    FROM attendance a
    WHERE a.student_id = :student_id
    GROUP BY a.student_id
    """


def average_grade_query() -> str:
    return """
    SELECT
        user_id,
        ROUND(AVG(percentage), 2) AS average_grade_percentage
    FROM assignment_submission
    WHERE user_id = :user_id
    GROUP BY user_id
    """


def verify_parent_child_link_query() -> str:
    return """
    INSERT INTO parent_student_link (parent_id, student_id)
    SELECT parent.id, child.id
    FROM "user" AS parent
    JOIN "user" AS child
      ON child.username = :child_username
     AND child.role = 'student'
     AND child.school_id = parent.school_id
    WHERE parent.id = :parent_id
      AND parent.username = :parent_username
      AND parent.role = 'parent'
      AND :child_password IS NOT NULL
    """


def classroom_membership_guard_query() -> str:
    return """
    SELECT 1
    FROM classroom c
    JOIN classroom_membership cm ON cm.classroom_id = c.id
    JOIN "user" u ON u.id = cm.user_id
    WHERE cm.user_id = :user_id
      AND c.school_id = :school_id
      AND u.school_id = :school_id
    LIMIT 1
    """


def as_text_query(query: str):
    return text(query)
