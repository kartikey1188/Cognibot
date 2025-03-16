import os
import sys
import pytest
import logging
from unittest.mock import MagicMock, patch
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from app import create_app, db
from flask import json
from backend.data.transcript_generator import GetSingleLectureTranscript
from langchain_google_genai import ChatGoogleGenerativeAI

# Configure logging
logging.basicConfig(filename="test_results.log", level=logging.INFO, format="%(asctime)s - %(message)s")

@pytest.fixture(scope='module')
def test_client():
    flask_app = create_app()
    with flask_app.test_client() as testing_client:
        with flask_app.app_context():
            db.create_all()
            yield testing_client
            db.session.remove()
            db.drop_all()

def mock_get_single_lecture_transcript(lecture_id):
    if lecture_id == 1:
        return {"Transcript": "This is a sample lecture transcript."}
    return {"Transcript": ""}  # Simulating empty transcript case

def mock_llm_invoke(messages):
    return MagicMock(content="This is a mock summary of the lecture.")

@patch.object(GetSingleLectureTranscript, 'get', side_effect=mock_get_single_lecture_transcript)
@patch.object(ChatGoogleGenerativeAI, 'invoke', side_effect=mock_llm_invoke)
def test_lecture_summary_success(mock_get, mock_llm, test_client):
    response = test_client.get("/lecture_summary/1")
    data = json.loads(response.data)
    
    logging.info("Test: test_lecture_summary_success")
    logging.info("Expected Output: {\"lecture_summary\": \"This is a mock summary of the lecture.\"}")
    logging.info(f"Actual Output: {data}")
    
    assert response.status_code == 200
    assert "lecture_summary" in data
    assert data["lecture_summary"] == "This is a mock summary of the lecture."
    logging.info("Result: Success\n")

@patch.object(GetSingleLectureTranscript, 'get', side_effect=mock_get_single_lecture_transcript)
def test_lecture_summary_empty_transcript(mock_get, test_client):
    response = test_client.get("/lecture_summary/2")  # ID 2 has empty transcript
    data = json.loads(response.data)
    
    logging.info("Test: test_lecture_summary_empty_transcript")
    logging.info("Expected Output: {\"Error\": \"Transcript not found or empty\"}")
    logging.info(f"Actual Output: {data}")
    
    assert response.status_code == 404
    assert "Error" in data
    assert data["Error"] == "Transcript not found or empty"
    logging.info("Result: Success\n")

@patch.object(GetSingleLectureTranscript, 'get', side_effect=Exception("Database error"))
def test_lecture_summary_exception(mock_get, test_client):
    response = test_client.get("/lecture_summary/3")  # Simulate failure
    data = json.loads(response.data)
    
    logging.info("Test: test_lecture_summary_exception")
    logging.info("Expected Output: {\"Error\": \"Failed to retrieve transcript\"}")
    logging.info(f"Actual Output: {data}")
    
    assert response.status_code == 500
    assert "Error" in data
    assert data["Error"] == "Failed to retrieve transcript"
    logging.info("Result: Success\n")
