from pathlib import Path

class Config:

    SECRET_KEY = "notakey"

    BASE_DIR = Path(__file__).resolve().parent.parent  # Points to 'backend' dir
    DB_PATH = BASE_DIR / "data" / "app.db"

    FIREBASE_CERT_PATH = BASE_DIR / "firebase" / "serviceAccountKey.json"

    SQLALCHEMY_DATABASE_URI = f"sqlite:///{DB_PATH}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
