def generate_insights(attendance_pct: float, marks_pct: float, trend_pct: float) -> dict:
    summary = f"Attendance {attendance_pct}%, marks {marks_pct}%, trend {trend_pct}%."
    strengths = ["Regular class participation"] if attendance_pct >= 80 else ["Shows potential"]
    weaknesses = ["Needs stronger revision consistency"] if marks_pct < 75 else ["Can improve advanced problem solving"]
    recommendation = "Practice 30 minutes of focused numerical problems daily."
    return {
        "performance_summary": summary,
        "strengths": strengths,
        "weaknesses": weaknesses,
        "actionable_recommendation": recommendation,
    }
