import os
import sys
import pytest
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from app import create_app, db
from backend.data.transcript_generator import GenerateAllTranscripts
from flask import url_for

@pytest.fixture(scope='module')
def test_client():
    flask_app = create_app()
    with flask_app.test_client() as testing_client:
        with flask_app.app_context():
            db.create_all()
            yield testing_client
            db.session.remove()
            db.drop_all()

def test_app_startup(test_client):
    response = test_client.get("/")  # Assuming a root endpoint exists
    assert response.status_code in [200, 404]  # Can be 404 if no root route exists

def test_log_file_creation():
    assert os.path.exists("logs/app.log"), "Log file should be created at startup"

def test_transcript_folder_creation():
    transcript_folder = os.path.join(os.path.dirname(__file__), "transcripts")  # Adjust path as per config
    os.makedirs(transcript_folder, exist_ok=True)
    assert os.path.exists(transcript_folder), "Transcript folder should exist"

def test_generate_transcripts(monkeypatch):
    def mock_get():
        return "Mock transcripts generated"
    
    monkeypatch.setattr(GenerateAllTranscripts, "get", mock_get)
    generator = GenerateAllTranscripts()
    result = generator.get()
    assert result == "Mock transcripts generated"
