from statistics import mean

from reports.graph_generator import generate_attendance_graph, generate_subject_graph
from reports.pdf_generator import build_pdf_report


def calculate_average_grade_percentage(percentages: list[float]) -> float:
    if not percentages:
        return 0.0
    return round(mean(percentages), 2)


def generate_report_bundle(
    student_id: int,
    report_type: str,
    assignment_percentages: list[float] | None = None,
    attendance_percentage: float = 0.0,
    trend_percentage: float = 0.0,
) -> dict:
    assignment_percentages = assignment_percentages or []
    attendance_graph = generate_attendance_graph(student_id)
    marks_graph = generate_subject_graph(student_id)
    average_grade_percentage = calculate_average_grade_percentage(assignment_percentages)

    payload = {
        "student_id": student_id,
        "average_grade_percentage": average_grade_percentage,
        "marks_percentage": average_grade_percentage,
        "attendance_percentage": attendance_percentage,
        "trend_percentage": trend_percentage,
        "assignment_percentages": assignment_percentages,
        "attendance_graph": attendance_graph,
        "marks_graph": marks_graph,
        "report_type": report_type,
        "alerts": ["Irregular attendance pattern"] if assignment_percentages else [],
        "insight": "Performance improving. Focus on problem-solving practice.",
    }

    pdf_path = build_pdf_report(payload, report_type)
    payload["pdf_path"] = pdf_path
    return payload
