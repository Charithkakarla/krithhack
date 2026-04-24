from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str = ""
    supabase_url: str = ""
    supabase_key: str = ""
    groq_api_key: str = ""
    groq_model: str = "llama-3.1-8b-instant"

    # Evolution API (WhatsApp)
    evolution_url: str = "http://localhost:8080"
    evolution_instance: str = "school_bot"
    evolution_api_key: str = ""          # Optional — set in Evolution dashboard
    # Seconds to wait between outbound messages (anti-spam guard)
    evolution_message_delay: int = 3

    # OCR
    tesseract_cmd: str = ""

    model_config = SettingsConfigDict(
        env_file=".env", 
        case_sensitive=False, 
        extra="ignore"
    )

settings = Settings()

