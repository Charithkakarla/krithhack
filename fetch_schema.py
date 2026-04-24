import requests
from backend.utils.config import settings

def get_schema():
    headers = {
        "apikey": settings.supabase_key,
        "Authorization": f"Bearer {settings.supabase_key}"
    }
    
    res = requests.get(f"{settings.supabase_url.rstrip('/')}/?apikey={settings.supabase_key}", headers=headers)
    if res.status_code == 200:
        spec = res.json()
        definitions = spec.get("definitions", {})
        
        tables = ["class_session", "classroom"]
        for t in tables:
            if t in definitions:
                props = definitions[t].get("properties", {})
                print(f"Table '{t}': {list(props.keys())}")
            else:
                print(f"Table '{t}' not found.")
    else:
        print("Failed to fetch OpenAPI spec:", res.text)

if __name__ == "__main__":
    get_schema()
