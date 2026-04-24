# WhatsApp AI School Assistant Backend (FastAPI)

Production-ready modular FastAPI backend for an agentic AI School Assistant with:

- Reactive WhatsApp Q&A
- Proactive daily/weekly messaging
- Attendance analytics
- Result and report analytics
- Matplotlib graph generation
- PDF report generation with fpdf
- OCR + RAG document understanding
- Test generation/submission/evaluation pipeline
- Gemini-based insights and intent detection
- Supabase-ready DB/storage integrations

## Tech Stack

- FastAPI
- PostgreSQL (Supabase-compatible via SQLAlchemy)
- Gemini API (`google-generativeai`)
- Twilio WhatsApp API
- matplotlib
- fpdf2
- pytesseract
- Supabase storage client

## Project Structure

- app/services/
  - attendance_service.py
  - report_service.py
  - graph_service.py
  - ai_service.py
  - alert_service.py
  - rag_service.py
  - ocr_service.py
  - whatsapp_service.py
  - test_service.py
  - orchestrator_service.py
- app/routes/
- app/db/
- app/models/
- app/utils/

## Required Endpoints

- `POST /api/v1/webhook`
- `GET /api/v1/attendance/{student_id}`
- `GET /api/v1/generate-report/{student_id}`
- `POST /api/v1/start-test`
- `POST /api/v1/submit-test`
- `POST /api/v1/upload-document`
- `POST /api/v1/ask-document`
- `GET /api/v1/send-daily-report`
- `GET /api/v1/send-weekly-report`

## Setup

1. Create and activate a virtual environment.
2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Copy `.env.example` to `.env` and fill values.
4. Run the API:

```bash
uvicorn app.main:app --reload
```

5. Open docs at `http://localhost:8000/docs`.

## Database Tables

Implemented tables:

- `user`
- `parent_student_link`
- `classroom`
- `class_session`
- `attendance`
- `assignment_submission`
- `documents`
- `tests`

## Notes

- `AUTO_SEED=true` inserts dummy parent/student, sessions, attendance, and assignment data for testing.
- Twilio/Gemini/Supabase are optional at runtime; if keys are missing, safe fallback behavior is used.
- OCR requires Tesseract installed on the host machine; set `TESSERACT_CMD` if needed.
