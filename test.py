import google.generativeai as genai
import os

api_key = ""

if not api_key:
    print("❌ Error: GEMINI_API_KEY not found in .env file")
else:
    genai.configure(api_key=api_key)
    print("Checking available models...")
    try:
        found = False
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(f"- {m.name}")
                found = True
        if not found:
            print("No models found. Check your API Key permissions.")
    except Exception as e:
        print(f"Error listing models: {e}")