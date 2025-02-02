from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv
import os
load_dotenv()
class Config:

    SECRET_KEY = os.getenv("SECRET_KEY")

    BASE_DIR = Path(__file__).resolve().parent.parent  # Points to 'backend' dir
    DB_PATH = BASE_DIR / "data" / "app.db"

    FIREBASE_CERT_PATH = BASE_DIR / "firebase" / "serviceAccountKey.json"

    SQLALCHEMY_DATABASE_URI = f"sqlite:///{DB_PATH}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
    # JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=2) 
    JWT_VERIFY_SUB=False
    JWT_TOKEN_LOCATION = ["cookies"]
    # JWT_COOKIE_SECURE = True  # For HTTPS 
    JWT_COOKIE_CSRF_PROTECT = False # Don't know where to store the token on the client side. A non-http only cookie is vulnerable to XSS
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=2)
    # JWT_COOKIE_SAMESITE = "Strict" # Client and server are on different ports
    JWT_COOKIE_HTTPONLY = True  # Protects against XSS
