import logging
from fastapi import FastAPI

from backend.routes.api import router as api_router

logging.basicConfig(level=logging.INFO, format="%(levelname)s:     %(message)s")

app = FastAPI(title="WhatsApp AI School Assistant")
app.include_router(api_router, prefix="/api/v1")


@app.get("/")
def health() -> dict:
    return {"status": "ok", "service": "school-assistant"}
