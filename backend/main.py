from fastapi import FastAPI

from backend.routes.api import router as api_router

app = FastAPI(title="WhatsApp AI School Assistant")
app.include_router(api_router, prefix="/api/v1")


@app.get("/")
def health() -> dict:
    return {"status": "ok", "service": "school-assistant"}
