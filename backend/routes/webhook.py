from fastapi import APIRouter, Request, Query
from fastapi.responses import JSONResponse, PlainTextResponse
import os
from backend.agents.orchestrator import process_message
from backend.utils.config import settings

router = APIRouter()

# Meta WhatsApp webhook verification (GET)
@router.get("/webhook")
async def verify_webhook(
    hub_mode: str = Query(None, alias="hub.mode"),
    hub_challenge: str = Query(None, alias="hub.challenge"),
    hub_verify_token: str = Query(None, alias="hub.verify_token")
) -> PlainTextResponse:
    if (
        hub_mode == "subscribe"
        and hub_verify_token == settings.meta_wa_webhook_verify_token
        and hub_challenge
    ):
        return PlainTextResponse(hub_challenge)
    return PlainTextResponse("Verification failed", status_code=403)

# Meta WhatsApp message webhook (POST)
@router.post("/webhook")
async def receive_message(request: Request):
    data = await request.json()
    # Parse Meta WhatsApp message structure
    try:
        entry = data["entry"][0]
        changes = entry["changes"][0]
        value = changes["value"]
        messages = value.get("messages", [])
        if messages:
            msg = messages[0]
            sender = msg["from"]
            text = msg["text"]["body"] if "text" in msg else ""
            intent, response_text = process_message(sender, text)
            # Optionally: send a reply via Meta API here
            return JSONResponse({"intent": intent, "response_text": response_text})
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=400)
    return JSONResponse({"status": "ignored"})
