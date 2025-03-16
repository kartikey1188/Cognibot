import os
import sys
import pytest
import logging
from unittest.mock import patch, MagicMock
from flask import json
from flask_restful import Api

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from app import create_app, db
from app.apis.faq import FAQSuggestions, ReceiveDoubt

# Configure logging
logging.basicConfig(filename="test_results.log", level=logging.INFO, format="%(asctime)s - %(message)s")

@pytest.fixture(scope='module')
def test_client():
    """Creates a Flask test client."""
    flask_app = create_app()
    flask_app.testing = True
    api = Api(flask_app)
    api.add_resource(FAQSuggestions, "/faq_suggestions/<int:lecture_id>")
    api.add_resource(ReceiveDoubt, "/receive_doubt")
    
    with flask_app.test_client() as testing_client:
        with flask_app.app_context():
            db.create_all()
            yield testing_client
            db.session.remove()
            db.drop_all()

@patch("app.apis.faq.client.collection")
def test_receive_doubt_success(mock_firestore, test_client):
    """Test successful posting of a student doubt."""
    mock_firestore.return_value.add.return_value = None  # Mock Firestore add
    
    response = test_client.post("/receive_doubt", json={"lecture_id": 101, "doubt": "What is recursion?"})
    data = json.loads(response.data)
    
    assert response.status_code == 201
    assert data["Message"] == "Question/Doubt received successfully"

@patch("app.apis.faq.client.collection")
def test_receive_doubt_failure(mock_firestore, test_client):
    """Test failure scenario when posting a doubt."""
    mock_firestore.side_effect = Exception("Firestore write failed")
    
    response = test_client.post("/receive_doubt", json={"lecture_id": 102, "doubt": "Explain OOP."})
    data = json.loads(response.data)
    
    assert response.status_code == 500
    assert "Error" in data
    assert data["Error"] == "Failed to receive question/doubt."

@patch("app.apis.faq.get_faq_history")
@patch("app.apis.faq.llm.invoke")
def test_faq_suggestions_success(mock_llm, mock_faq_history, test_client):
    """Test successful retrieval of FAQ suggestions."""
    mock_faq_history.return_value = ["What is recursion?", "What is recursion?", "Explain OOP concepts."]
    mock_llm.return_value = type("MockAIResponse", (), {"content": "Focus on recursion, as it is frequently asked."})()
    
    response = test_client.get("/faq_suggestions/101")
    data = json.loads(response.data)
    
    assert response.status_code == 200
    assert "faq_suggestions" in data
    assert data["faq_suggestions"] == "Focus on recursion, as it is frequently asked."

@patch("app.apis.faq.get_faq_history")
def test_faq_suggestions_no_data(mock_faq_history, test_client):
    """Test retrieval of FAQ suggestions when no questions exist."""
    mock_faq_history.return_value = []
    
    response = test_client.get("/faq_suggestions/102")
    data = json.loads(response.data)
    
    assert response.status_code == 200
    assert "faq_suggestions" in data
    assert data["faq_suggestions"] == "No questions/doubts asked by the students for this lecture."

@patch("app.apis.faq.get_faq_history")
def test_faq_suggestions_failure(mock_faq_history, test_client):
    """Test handling of errors in FAQ suggestions API."""
    mock_faq_history.side_effect = Exception("Firestore read failed")
    
    response = test_client.get("/faq_suggestions/103")
    data = json.loads(response.data)
    
    assert response.status_code == 500
    assert "Error" in data
    assert data["Error"] == "Failed to retrieve suggestions on frequently asked questions."
