def get_attendance_summary(student_id: int, present_count: int = 0, late_count: int = 0, total_sessions: int = 0) -> dict:
    overall_percentage = 0.0
    if total_sessions > 0:
        overall_percentage = round(((present_count + late_count) / total_sessions) * 100, 2)

    attended = present_count + late_count
    response = (
        f"Student {student_id} attended {attended}/{total_sessions} sessions "
        f"({overall_percentage}%)."
    )

    return {
        "student_id": student_id,
        "present_count": present_count,
        "late_count": late_count,
        "total_sessions": total_sessions,
        "overall_attendance_percentage": overall_percentage,
        "response_text": response,
    }
