import warnings
warnings.filterwarnings("ignore", category=UserWarning, module="langsmith")

from app import create_app, db
from app.utils.seed import add_initial_users
from flask_cors import CORS
from backend.app.utils.transcript_generator import GenerateAllTranscripts
from backend.app.utils.lecture_vectordb_generator import GenerateLectureVectorDB
from backend.app.utils.embed_pdf import GenerateHandbookVectorDB
from backend.app.utils.embed_txt import GenerateGradingDocVectorDB
import os
import logging
from logging.handlers import RotatingFileHandler
from dotenv import load_dotenv
from flask import send_file
from flask_swagger_ui import get_swaggerui_blueprint

app = create_app()

load_dotenv()

CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# Configuring logging
if not os.path.exists('logs'):
    os.makedirs('logs')
file_handler = RotatingFileHandler('logs/app.log', maxBytes=10240, backupCount=10)
file_handler.setFormatter(logging.Formatter(
    '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'))
file_handler.setLevel(logging.INFO)
app.logger.addHandler(file_handler)
app.logger.setLevel(logging.INFO)
app.logger.info('App startup')

# Swagger UI setup
SWAGGER_URL = ''  # Swagger UI served at localhost:5000
API_URL = '/static/openapi.yaml'  # the static folder is backend/docs folder

swaggerui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={'app_name': "Team 11 API Docs"}
)
app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        add_initial_users()

        # Ensuring the vector database folder exists
        vectordb_folder = os.path.join(os.path.dirname(__file__), app.config["VECTORDB_FOLDER"])
        os.makedirs(vectordb_folder, exist_ok=True)

        # Ensuring the transcript folder exists
        transcript_folder = os.path.join(os.path.dirname(__file__), app.config["TRANSCRIPT_FOLDER"])
        os.makedirs(transcript_folder, exist_ok=True)

        # Checking if the transcript folder is empty
        if not os.listdir(transcript_folder):
            # Generating all transcripts
            generator = GenerateAllTranscripts()
            generator.get()
            app.logger.info(f"Generated transcripts in folder: {transcript_folder}")
        else:
            app.logger.info(f"Transcript folder is not empty. Skipping transcript generation.")

        # Checking if the vector database folder is empty
        if len(os.listdir(vectordb_folder)) < 2:
            # Generating database and add lecture chunks
            generator1 = GenerateLectureVectorDB()
            generator1.get()
            app.logger.info(f"Generated vector database and added lecture chunks in folder: {vectordb_folder}")

            # Adding handbook chunks
            generator2 = GenerateHandbookVectorDB()
            generator2.get()
            app.logger.info(f"Added handbook chunks to the database in the folder: {vectordb_folder}")

            # Adding grading doc chunks
            generator3 = GenerateGradingDocVectorDB()
            generator3.get()
            app.logger.info(f"Added grading doc chunks to the database in the folder: {vectordb_folder}")
            app.logger.info("WE HAVE A UNIFIED VECTOR DATABASE NOW CONTAINING LECTURE, HANDBOOK, AND GRADING DOC CHUNKS")
        else:
            app.logger.info(f"Vector database folder is not empty. Skipping vector database generation.")

    port = int(os.environ.get("PORT", 5000))
    debug_mode = os.getenv("FLASK_DEBUG", "false").strip().lower() == "true"
    app.run(host='0.0.0.0', debug=debug_mode, port = port)
