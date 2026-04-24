from fastapi import APIRouter

from backend.services.attendance_service import get_attendance_summary

router = APIRouter()


@router.get("/attendance/{student_id}")
def attendance(student_id: int) -> dict:
    return get_attendance_summary(student_id)
