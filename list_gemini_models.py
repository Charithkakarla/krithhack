import os
import google.generativeai as genai
from dotenv import load_dotenv

def list_models():
    load_dotenv()
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("No API key")
        return
    
    genai.configure(api_key=api_key)
    try:
        models = genai.list_models()
        print("Available models supporting generateContent:")
        for m in models:
            if 'generateContent' in m.supported_generation_methods:
                print(m.name)
    except Exception as e:
        print("Error listing models:", e)

if __name__ == "__main__":
    list_models()
