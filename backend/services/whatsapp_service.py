"""
WhatsApp service — Evolution API adapter.

Replaces Twilio/Meta. All outgoing messages go through send_message().
A configurable delay (EVOLUTION_MESSAGE_DELAY seconds, default 3) is
enforced between every outgoing message to avoid WhatsApp spam detection.
"""

import time
import logging
import requests
from backend.utils.config import settings

logger = logging.getLogger(__name__)

# Track the last send time globally within this process.
_last_sent_at: float = 0.0


def _build_headers() -> dict:
    headers = {"Content-Type": "application/json"}
    if settings.evolution_api_key:
        headers["apikey"] = settings.evolution_api_key
    return headers


def send_message(number: str, text: str) -> bool:
    """
    Send a WhatsApp text message via Evolution API.

    Parameters
    ----------
    number : str
        Recipient phone number in E.164 format WITHOUT the '+' sign,
        e.g. '919876543210'  (country code + number, no spaces/dashes).
    text : str
        Plain text body to send.

    Returns
    -------
    bool
        True if the API accepted the message, False otherwise.
    """
    global _last_sent_at

    # ── Anti-spam rate limiter ─────────────────────────────────────────────
    delay = settings.evolution_message_delay
    elapsed = time.time() - _last_sent_at
    if elapsed < delay:
        wait = delay - elapsed
        logger.debug("Rate-limit: sleeping %.1fs before next message.", wait)
        time.sleep(wait)
    # ──────────────────────────────────────────────────────────────────────

    url = (
        f"{settings.evolution_url}/message/sendText"
        f"/{settings.evolution_instance}"
    )
    payload = {
        "number": number,
        "options": {
            "delay": int(delay * 1000),
            "presence": "composing"
        },
        "textMessage": {
            "text": text
        }
    }

    try:
        response = requests.post(
            url,
            json=payload,
            headers=_build_headers(),
            timeout=10,
        )
        _last_sent_at = time.time()

        if response.ok:
            logger.info("Message sent to %s ✓", number)
            return True
        else:
            logger.error(
                "Evolution API error %s: %s",
                response.status_code,
                response.text[:200],
            )
            return False

    except requests.exceptions.ConnectionError:
        logger.error(
            "Cannot reach Evolution API at %s — is it running?",
            settings.evolution_url,
        )
        return False
    except Exception as exc:  # noqa: BLE001
        logger.exception("Unexpected error sending WhatsApp message: %s", exc)
        return False


def send_template_message(number: str, template: str, **kwargs) -> bool:
    """
    Convenience wrapper — format a template string and send it.

    Example:
        send_template_message("919876543210",
                              "Hi {name}, your attendance is {pct}%",
                              name="Raju", pct=88)
    """
    return send_message(number, template.format(**kwargs))

import base64
import os

def send_document(number: str, file_path: str, caption: str = "") -> bool:
    """
    Send a document (PDF, etc) via Evolution API.
    """
    global _last_sent_at

    delay = settings.evolution_message_delay
    elapsed = time.time() - _last_sent_at
    if elapsed < delay:
        wait = delay - elapsed
        time.sleep(wait)

    url = f"{settings.evolution_url}/message/sendMedia/{settings.evolution_instance}"
    
    if not os.path.exists(file_path):
        logger.error("File not found: %s", file_path)
        return False

    with open(file_path, "rb") as f:
        media_base64 = base64.b64encode(f.read()).decode("utf-8")
        
    file_name = os.path.basename(file_path)

    payload = {
        "number": number,
        "options": {
            "delay": int(delay * 1000),
            "presence": "composing"
        },
        "mediaMessage": {
            "mediatype": "document",
            "caption": caption,
            # Evolution usually expects the base64 string directly, or with the mime prefix
            "media": media_base64,
            "fileName": file_name
        }
    }

    try:
        response = requests.post(url, json=payload, headers=_build_headers(), timeout=30)
        _last_sent_at = time.time()
        if response.ok:
            logger.info("Document sent to %s ✓", number)
            return True
        else:
            logger.error("Evolution API media error %s: %s", response.status_code, response.text[:200])
            return False
    except Exception as exc:
        logger.exception("Unexpected error sending document: %s", exc)
        return False
