from pydantic_settings import BaseSettings, SettingsConfigDict



class Settings(BaseSettings):
    database_url: str = ""
    supabase_url: str = ""
    supabase_key: str = ""
    gemini_api_key: str = ""
    meta_wa_access_token: str = ""
    meta_wa_phone_number_id: str = ""
    meta_wa_app_id: str = ""
    meta_wa_app_secret: str = ""
    meta_wa_webhook_verify_token: str = ""
    tesseract_cmd: str = ""

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=False)


settings = Settings()
