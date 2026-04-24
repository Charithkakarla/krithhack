from fastapi import APIRouter

from backend.services.report_service import generate_report_bundle

router = APIRouter()


@router.get("/generate-report/{student_id}")
def generate_report(student_id: int, report_type: str = "Weekly Report") -> dict:
    return generate_report_bundle(student_id, report_type)
