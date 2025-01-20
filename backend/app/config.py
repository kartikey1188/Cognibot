import os

class Config:
    # General Configurations
    SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key')
    DEBUG = os.environ.get('FLASK_DEBUG', 'True') == 'True'
    
    # Database Configurations (SQLite in this case)
    SQLALCHEMY_DATABASE_URI = os.environ.get('SQLALCHEMY_DATABASE_URI', 'sqlite:///data/app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False  # Avoid unnecessary overhead

    # Chroma DB settings (for vector embeddings)
    CHROMA_DB_PATH = os.environ.get('CHROMA_DB_PATH', 'data/embeddings.npy')
    
    # File Upload configurations
    UPLOAD_FOLDER = 'data/uploads'
    ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}
    
    # Other settings as needed
    ENV = os.environ.get('FLASK_ENV', 'development')  # Can be 'development', 'production', etc.
