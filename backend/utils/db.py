import logging
from supabase import create_client, Client
from backend.utils.config import settings

logger = logging.getLogger(__name__)

supabase: Client | None = None

if settings.supabase_url and settings.supabase_key:
    try:
        # The supabase-py client automatically appends /rest/v1, so we must remove it if present in the .env
        clean_url = settings.supabase_url.replace("/rest/v1/", "").replace("/rest/v1", "").rstrip("/")
        supabase = create_client(clean_url, settings.supabase_key)
    except Exception as e:
        logger.error("Failed to initialize Supabase: %s", e)

def find_student(phone_number: str, text: str) -> dict | None:
    if not supabase:
        return None
    try:
        # 1. We search for the parent's phone number to find their child's records
        response = supabase.table("students").select("*").eq("parent_phone", phone_number).execute()
        if response.data:
            return response.data[0]
            
        # 2. If phone fails, see if the user provided a student name or roll number in the text
        all_students = supabase.table("students").select("id, name, roll_no").execute()
        text_lower = text.lower()
        for s in all_students.data:
            # Check if name or roll number is in the message
            if s['name'].lower() in text_lower or s['roll_no'].lower() in text_lower:
                # Found a match! Update their phone number to auto-link them for the future
                supabase.table("students").update({"parent_phone": phone_number}).eq("id", s["id"]).execute()
                # Also update the user table if it exists
                try:
                    supabase.table("user").update({"phone": phone_number}).eq("name", s["name"]).execute()
                except Exception:
                    pass
                
                # Fetch full data
                full_student = supabase.table("students").select("*").eq("id", s["id"]).execute()
                return full_student.data[0] if full_student.data else None
                
        return None
    except Exception as e:
        logger.error("Database query failed: %s", e)
        return None
