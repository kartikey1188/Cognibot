from pathlib import Path
from datetime import timedelta
class Config:

    SECRET_KEY = "notakey"

    BASE_DIR = Path(__file__).resolve().parent.parent  # Points to 'backend' dir
    DB_PATH = BASE_DIR / "data" / "app.db"

    FIREBASE_CERT_PATH = BASE_DIR / "firebase" / "serviceAccountKey.json"

    SQLALCHEMY_DATABASE_URI = f"sqlite:///{DB_PATH}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = "supersecretkey123"
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=3) 
    JWT_VERIFY_SUB=False
