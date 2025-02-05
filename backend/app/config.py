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
    JWT_VERIFY_SUB=False
    JWT_TOKEN_LOCATION = ["cookies"]
    JWT_COOKIE_CSRF_PROTECT = False 
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=2)
    JWT_COOKIE_HTTPONLY = True  
    # It does not really matter whether you store your JSON Web Tokens in a cookie or localStorage.
    # If your site is vulnerable to XSS, an attacker can steal the JWT from a cookie or localStorage.
    # The HttpOnly flag prevents the cookie from being accessed through JavaScript.
    # This means that the JWT is only sent in HTTP requests to the server.
    # This is a good thing because it prevents an attacker from stealing the JWT using XSS.
    # However, the JWT is still vulnerable to CSRF attacks.
    # To protect against CSRF attacks, you should use the SameSite cookie attribute.
    # However, this does not really solve anything.
    # The only way to prevent XSS is to do proper input sanitization, output encoding, and use CSP (Content Security Policy).
    # CSP can be implemented using meta tags or HTTP headers.