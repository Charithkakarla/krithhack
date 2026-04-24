"""
Webhook endpoint for Evolution API (WhatsApp).

Evolution API POST payload structure:
{
  "event": "messages.upsert",
  "instance": "school-bot",
  "data": {
    "key": {
      "remoteJid": "919876543210@s.whatsapp.net",
      "fromMe": false,
      "id": "..."
    },
    "message": {
      "conversation": "hello"          // plain text
      // OR
      "extendedTextMessage": { "text": "hello" }
    },
    "messageType": "conversation",
    "messageTimestamp": 1234567890
  }
}
"""

import logging
from fastapi import APIRouter, Request, BackgroundTasks
from fastapi.responses import JSONResponse

from backend.agents.orchestrator import process_message

logger = logging.getLogger(__name__)
router = APIRouter()

# Keep track of recently processed message IDs to prevent Evolution sync duplicates
_processed_message_ids = set()


def _extract_text(message: dict) -> str:
    """Pull plain text from an Evolution API message object."""
    if "conversation" in message:
        return message["conversation"]
    if "extendedTextMessage" in message:
        return message["extendedTextMessage"].get("text", "")
    # Unsupported type (image, audio, sticker…)
    return ""


@router.post("/webhook")
async def receive_message(request: Request, background_tasks: BackgroundTasks):
    """
    Receives all WhatsApp events from Evolution API.
    Only processes inbound text messages; silently ignores everything else.
    """
    try:
        data = await request.json()
    except Exception:
        return JSONResponse({"error": "invalid JSON"}, status_code=400)

    event = data.get("event", "")
    logger.debug("Evolution event: %s", event)

    # Only care about new inbound messages (ignore read receipts, delivery status)
    if event != "messages.upsert":
        return JSONResponse({"status": "ignored", "event": event})

    try:
        msg_data = data["data"]
        
        # Evolution v1 sometimes wraps the payload differently if 'Webhook by events' is enabled
        # If 'key' is missing, maybe the payload is structured directly.
        key = msg_data.get("key", {})
        if not key:
            logger.warning("Dropped: no key in payload. Data: %s", msg_data)
            return JSONResponse({"status": "ignored", "reason": "no key in payload"})

        # Skip messages sent by ourselves
        if key.get("fromMe", False) or msg_data.get("fromMe", False):
            logger.debug("Dropped: self-message")
            return JSONResponse({"status": "self-message, skipped"})
            
        # Check for duplicate message ID to prevent infinite loops from Evolution sync
        msg_id = key.get("id", "")
        if msg_id in _processed_message_ids:
            logger.warning("Dropped: duplicate message ID: %s", msg_id)
            return JSONResponse({"status": "duplicate, skipped"})
        if msg_id:
            _processed_message_ids.add(msg_id)
            # Basic memory management: keep set size small
            if len(_processed_message_ids) > 1000:
                _processed_message_ids.clear()

        remote_jid = key.get("remoteJid", "")
        
        # Some accounts show up as @lid instead of @s.whatsapp.net
        if "@g.us" in remote_jid:
            logger.warning("Dropped: Group message")
            return JSONResponse({"status": "ignored", "reason": "group message"})
            
        # Keep the exact raw sender ID initially
        sender = remote_jid
        
        # If it's your friend's Linked Device (@lid), manually route it to their real phone number!
        if "@lid" in remote_jid:
            sender = "917799663979"
            logger.info("Mapped friend's @lid back to real phone number: %s", sender)



        message = msg_data.get("message", {})
        text = _extract_text(message).strip()

        if not text:
            logger.warning("Dropped: non-text message. Message object: %s", message)
            return JSONResponse({"status": "non-text message, skipped"})

        logger.info("Message from %s: %s", sender, text)

        # Pass the raw text directly
        clean_text = text

        # Delegate to orchestrator in the background so the webhook returns 200 OK instantly!
        background_tasks.add_task(process_message, sender, clean_text)

        return JSONResponse({"status": "processing_in_background"})

    except KeyError as exc:
        logger.warning(f"Unexpected Evolution payload — missing key: {exc}")
        logger.warning(f"Raw payload was: {data}")
        return JSONResponse({"error": f"missing key: {exc}"}, status_code=422)
    except Exception as exc:
        logger.exception(f"Webhook processing error: {exc}")
        return JSONResponse({"error": str(exc)}, status_code=500)

