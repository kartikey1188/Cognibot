from pathlib import Path
import json
import os
from langchain_google_genai import ChatGoogleGenerativeAI

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

def get_llm():
    return ChatGoogleGenerativeAI(
        model="gemini-1.5-flash",
        google_api_key=GOOGLE_API_KEY
    )


questions_path = Path(__file__).resolve().parent.parent.parent / 'data' / 'questions' / 'python_w1.json'

def load_questions(path=questions_path):
    with open(path, 'r') as f:
        return json.load(f)

