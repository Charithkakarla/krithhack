from fastapi import APIRouter
from pydantic import BaseModel

from rag.retrieval import ask_document

router = APIRouter()


class AskBody(BaseModel):
    student_id: int
    question: str


@router.post("/ask-document")
def ask(body: AskBody) -> dict:
    return ask_document(body.student_id, body.question)
