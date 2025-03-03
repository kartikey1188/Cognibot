from app import create_app, db
from app.utils.seed import add_initial_users
from flask_cors import CORS
from backend.data.transcript_generator import GenerateAllTranscripts
from backend.data.vectordb_generator import GenerateVectorDB
import os
import logging
from logging.handlers import RotatingFileHandler
import warnings
from dotenv import load_dotenv

# Suppress specific warnings
warnings.filterwarnings("ignore", category=DeprecationWarning, module="langchain")
warnings.filterwarnings("ignore", category=UserWarning, module="langsmith")
warnings.filterwarnings("ignore", category=DeprecationWarning, module="langchain_community.vectorstores")

app = create_app()

load_dotenv()

CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# Configure logging
if not os.path.exists('logs'):
    os.makedirs('logs')
file_handler = RotatingFileHandler('logs/app.log', maxBytes=10240, backupCount=10)
file_handler.setFormatter(logging.Formatter(
    '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'))
file_handler.setLevel(logging.INFO)
app.logger.addHandler(file_handler)
app.logger.setLevel(logging.INFO)
app.logger.info('App startup')

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        add_initial_users()

        # Ensure the transcript folder exists
        transcript_folder = os.path.join(os.path.dirname(__file__), app.config["TRANSCRIPT_FOLDER"])
        os.makedirs(transcript_folder, exist_ok=True)

        # Check if the transcript folder is empty
        if not os.listdir(transcript_folder):
            # Generate all transcripts
            generator = GenerateAllTranscripts()
            generator.get()
            app.logger.info(f"Generated transcripts in folder: {transcript_folder}")
        else:
            app.logger.info(f"Transcript folder is not empty: {transcript_folder}")

        
    
    app.run(host='0.0.0.0', debug=True, port = 8080)