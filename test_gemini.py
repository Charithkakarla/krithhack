import os
import google.generativeai as genai
from dotenv import load_dotenv

def test_key():
    load_dotenv()
    api_key = os.getenv("GEMINI_API_KEY")
    model_name = os.getenv("GEMINI_MODEL", "gemini-1.5-flash-latest")
    
    if not api_key:
        print("❌ Error: GEMINI_API_KEY is missing from .env file.")
        return

    print(f"Testing key ending in ...{api_key[-4:]} with model '{model_name}'")
    
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel(model_name)
        response = model.generate_content("Say 'Hello, the key is working!' and nothing else.")
        print("✅ Success! Gemini response:", response.text.strip())
    except Exception as e:
        print("❌ Error while testing Gemini API Key:")
        print(e)

if __name__ == "__main__":
    test_key()
