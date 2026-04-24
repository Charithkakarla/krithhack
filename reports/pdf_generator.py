from datetime import datetime
from pathlib import Path

from fpdf import FPDF


def build_pdf_report(payload: dict, report_type: str) -> str:
    out = Path("tmp")
    out.mkdir(exist_ok=True)
    path = out / f"{report_type.lower().replace(' ', '_')}_{payload['student_id']}.pdf"

    pdf = FPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.set_font("Helvetica", "B", 16)
    pdf.cell(0, 10, f"{report_type}", ln=True)

    attendance_percentage = payload.get("attendance_percentage", payload.get("overall_attendance_percentage", 0.0))
    marks_percentage = payload.get("marks_percentage", payload.get("average_grade_percentage", 0.0))
    trend_percentage = payload.get("trend_percentage", 0.0)

    pdf.set_font("Helvetica", size=11)
    pdf.set_x(pdf.l_margin)
    pdf.multi_cell(0, 8, f"Generated: {datetime.utcnow().isoformat()} UTC")
    pdf.set_x(pdf.l_margin)
    pdf.multi_cell(0, 8, f"Attendance: {attendance_percentage}%")
    pdf.set_x(pdf.l_margin)
    pdf.multi_cell(0, 8, f"Marks: {marks_percentage}%")
    pdf.set_x(pdf.l_margin)
    pdf.multi_cell(0, 8, f"Trend: {trend_percentage}%")
    pdf.set_x(pdf.l_margin)
    pdf.multi_cell(0, 8, f"Insight: {payload['insight']}")

    pdf.ln(4)
    pdf.set_font("Helvetica", "B", 12)
    pdf.cell(0, 8, "Alerts", ln=True)
    pdf.set_font("Helvetica", size=11)
    for alert in payload.get("alerts", []):
        pdf.set_x(pdf.l_margin)
        pdf.multi_cell(0, 8, f"- {alert}")

    pdf.add_page()
    pdf.image(payload["attendance_graph"], x=10, y=20, w=185)
    pdf.image(payload["marks_graph"], x=10, y=130, w=185)

    pdf.output(str(path))
    return str(path)
