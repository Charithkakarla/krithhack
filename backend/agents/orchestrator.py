import logging
from backend.services.whatsapp_service import send_message, send_document
from backend.services.report_service import generate_report_bundle
from backend.utils.db import find_student
from ai.agent import generate_ai_response

logger = logging.getLogger(__name__)

def process_message(sender: str, text: str) -> tuple[str, str]:
    # Extract clean phone number for the database
    clean_sender = sender.replace("@s.whatsapp.net", "").replace("@c.us", "").replace("@lid", "")
    
    # 1. Fetch or auto-link student data from database using the clean number
    student_data = find_student(clean_sender, text)

    # 2. Let the LLM generate a smart, conversational response
    response_text = generate_ai_response(text, student_data)
    send_message(sender, response_text)

    # 3. If they specifically asked for a report, still generate the PDF!
    if "report" in text.lower() or "result" in text.lower():
        send_message(sender, "⏳ I'm also generating the official PDF report card for you...")
        try:
            # Use real student ID if available, else default to 1
            student_id = student_data["id"] if student_data else 1
            report_data = generate_report_bundle(student_id, "weekly")
            send_document(sender, report_data["pdf_path"], "Here is the official document! 📈")
        except Exception as e:
            logger.error("Failed to generate and send report: %s", e)
            send_message(sender, "Sorry, there was an error generating the PDF document.")

    return "ai_handled", response_text

