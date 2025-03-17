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

def mock_agent_executor_invoke(inputs):
    return {"output": "This is a mock clarification response."}

@patch("app.services.FirestoreChatMessageHistory")
@patch("app.services.clarification.Clarification.post", side_effect=mock_agent_executor_invoke)
def test_clarification_success(mock_invoke, mock_chat_history, test_client):
    response = test_client.post("/clarification", json={"user_id": 1, "quest": "What is recursion?"})
    data = json.loads(response.data)
    
    logging.info("Test: test_clarification_success")
    logging.info("Expected Output: {\"response\": \"This is a mock clarification response.\"}")
    logging.info(f"Actual Output: {data}")
    
    assert response.status_code == 200
    assert "response" in data
    assert data["response"] == "This is a mock clarification response."
    logging.info("Result: Success\n")

def test_clarification_missing_query(test_client):
    response = test_client.post("/clarification", json={"user_id": 1})
    data = json.loads(response.data)
    
    logging.info("Test: test_clarification_missing_query")
    logging.info("Expected Output: {\"Error\": \"A query is required\"}")
    logging.info(f"Actual Output: {data}")
    
    assert response.status_code == 400
    assert "Error" in data
    assert data["Error"] == "A query is required"
    logging.info("Result: Success\n")

@patch("app.services.clarification.Clarification.post", side_effect=Exception("Agent execution failed"))
def test_clarification_exception(mock_invoke, test_client):
    response = test_client.post("/clarification", json={"user_id": 1, "quest": "Explain OOP concepts."})
    data = json.loads(response.data)
    
    logging.info("Test: test_clarification_exception")
    logging.info("Expected Output: {\"Error\": \"Failed to process request\"}")
    logging.info(f"Actual Output: {data}")
    
    assert response.status_code == 500
    assert "Error" in data
    assert data["Error"] == "Failed to process request"
    logging.info("Result: Success\n")
