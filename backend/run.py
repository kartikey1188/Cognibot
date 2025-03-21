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
import warnings
from dotenv import load_dotenv
from flask import send_file
from flask_swagger_ui import get_swaggerui_blueprint

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

# Swagger UI setup
SWAGGER_URL = '/'  # Swagger UI served at '/'
API_URL = '/static/openapi.yaml'  # YAML file URL

swaggerui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={'app_name': "Team 11 API Docs"}
)
app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)

# @app.route('/')
# def get_yaml():
#     file_path = os.path.join(os.path.dirname(__file__), 'docs', 'openapi.yaml')
#     try:
#         with open(file_path, 'r') as f:
#             yaml_content = f.read()
#         return yaml_content, 200, {'Content-Type': 'text/plain'}
#     except Exception as e:
#         app.logger.error(f"Failed to read openapi.yaml: {e}")
#         return {"error": "Could not read YAML file"}, 500

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        add_initial_users()

        # Ensure the vector database folder exists
        vectordb_folder = os.path.join(os.path.dirname(__file__), app.config["VECTORDB_FOLDER"])
        os.makedirs(vectordb_folder, exist_ok=True)

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

        # Check if the vector database folder is empty
        if not os.listdir(vectordb_folder):
            # Generate database and add lecture chunks
            generator1 = GenerateLectureVectorDB()
            generator1.get()
            app.logger.info(f"Generated vector database and added lecture chunks in folder: {vectordb_folder}")

            # Add handbook chunks
            generator2 = GenerateHandbookVectorDB()
            generator2.get()
            app.logger.info(f"Added handbook chunks to the database in the folder: {vectordb_folder}")

            # Add grading doc chunks
            generator3 = GenerateGradingDocVectorDB()
            generator3.get()
            app.logger.info(f"Added grading doc chunks to the database in the folder: {vectordb_folder}")
            app.logger.info("WE HAVE A UNIFIED VECTOR DATABASE NOW CONTAINING LECTURE, HANDBOOK, AND GRADING DOC CHUNKS")
        else:
            app.logger.info(f"Vector database folder is not empty: {vectordb_folder}")
    
    app.run(host='0.0.0.0', debug=True, port = 5000)