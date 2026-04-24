from fastapi import APIRouter, Form

from backend.agents.orchestrator import process_message

router = APIRouter()


@router.post("/webhook")
def webhook(From: str = Form(...), Body: str = Form("")) -> dict:
    intent, response_text = process_message(From, Body)
    return {"intent": intent, "response_text": response_text}
