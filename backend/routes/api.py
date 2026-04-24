from fastapi import APIRouter

from backend.routes.attendance import router as attendance_router
from backend.routes.documents import router as documents_router
from backend.routes.reports import router as reports_router
from backend.routes.tests import router as tests_router
from backend.routes.webhook import router as webhook_router

router = APIRouter()
router.include_router(webhook_router)
router.include_router(attendance_router)
router.include_router(reports_router)
router.include_router(tests_router)
router.include_router(documents_router)
