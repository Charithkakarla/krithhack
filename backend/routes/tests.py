from fastapi import APIRouter
from pydantic import BaseModel

from backend.services.test_service import start_test, submit_test

router = APIRouter()


class StartTestBody(BaseModel):
    student_id: int


class SubmitTestBody(BaseModel):
    test_id: int
    selected_answers: list[str]


@router.post("/start-test")
def start(body: StartTestBody) -> dict:
    return start_test(body.student_id)


@router.post("/submit-test")
def submit(body: SubmitTestBody) -> dict:
    return submit_test(body.test_id, body.selected_answers)
