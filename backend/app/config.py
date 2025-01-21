from pathlib import Path

class Config:

    BASE_DIR = Path(__file__).resolve().parent.parent  # Points to 'backend' dir
    DB_PATH = BASE_DIR / "data" / "app.db"

    # SQLite URI using the constructed path
    SQLALCHEMY_DATABASE_URI = f"sqlite:///{DB_PATH}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    DEBUG = True
