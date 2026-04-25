# WhatsApp AI School Assistant Backend

This project is WhatsApp-first. The official user interaction channel is Twilio WhatsApp webhook messaging through the backend API.

Features implemented:
- Reactive WhatsApp query handling
- Attendance and report endpoints
- Graph generation and PDF generation
- OCR and document Q and A baseline
- Test generation and submission baseline
- Supabase-compatible SQL scripts

## Tech Stack

- FastAPI
- PostgreSQL and Supabase
- Gemini API
- Twilio WhatsApp API
- matplotlib
- fpdf2
- pytesseract

## Project Structure

- [backend](backend)
  - [backend/routes](backend/routes)
  - [backend/services](backend/services)
  - [backend/agents](backend/agents)
  - [backend/utils](backend/utils)
- [database](database)
  - [database/01_tables.sql](database/01_tables.sql)
  - [database/03_migrations.sql](database/03_migrations.sql)
  - [database/02_indexes.sql](database/02_indexes.sql)
  - [database/04_extra.sql](database/04_extra.sql)
- [reports](reports)
- [ai](ai)
- [rag](rag)

## Official Interaction Flow

Official frontend channel:
- WhatsApp message from parent or student
- Twilio forwards webhook request to backend endpoint
- Backend processes intent and responds via Twilio

Official webhook endpoint:
- POST /api/v1/webhook

## API Endpoints

- POST /api/v1/webhook
- GET /api/v1/attendance/{student_id}
- GET /api/v1/generate-report/{student_id}
- POST /api/v1/start-test
- POST /api/v1/submit-test
- POST /api/v1/ask-document

## Setup

1. Create a virtual environment and install dependencies.
2. Fill environment values in [.env](.env).
3. Run backend:
  uvicorn backend.main:app --host 127.0.0.1 --port 8000
4. Verify docs at http://127.0.0.1:8000/docs

## Twilio WhatsApp Setup

1. Create Twilio account and open WhatsApp Sandbox.
2. Put these values in [.env](.env):
  - TWILIO_ACCOUNT_SID
  - TWILIO_AUTH_TOKEN
  - TWILIO_WHATSAPP_NUMBER
  - PUBLIC_BASE_URL=http://127.0.0.1:8000
  - FRONTEND_PUBLIC_BASE_URL=http://127.0.0.1:5173
3. Expose local backend to internet using ngrok:
  ngrok http 8000
4. In Twilio Sandbox settings, set incoming webhook URL to:
  https://your-ngrok-domain/api/v1/webhook
5. Join sandbox from your phone using Twilio join code.
6. Send WhatsApp messages and verify replies from backend.

## Phone-Friendly Test Links

If you want the generated test link to open on a phone, set the public URLs in [.env](.env):

1. Set `PUBLIC_BASE_URL` to the public backend URL used by the webhook and API.
2. Set `FRONTEND_PUBLIC_BASE_URL` to the public URL that serves the website frontend.
3. If you serve the built frontend from the backend public URL, both values can be the same ngrok URL.
4. The WhatsApp test link should open the frontend route, and the page will submit back to the API URL carried in the link.

## Database Setup

Run SQL files in this order in Supabase SQL Editor:
1. [database/01_tables.sql](database/01_tables.sql)
2. [database/03_migrations.sql](database/03_migrations.sql)
3. [database/02_indexes.sql](database/02_indexes.sql)
4. Optional extras: [database/04_extra.sql](database/04_extra.sql)

