import os
import sys
import pytest
import logging
from unittest.mock import MagicMock, patch
from flask import json

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from app import create_app, db
from app.utils.helper_functions import load_questions, get_llm
from app.services.personalized_feedback import FeedBackAndRecommendations

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

def mock_load_questions():
    return {
        "questions": [
            {"qid": 1, "question": "What is Python?", "answer": ["A"], "type": "MCQ"},
            {"qid": 2, "question": "Which are Python data types?", "answer": ["B", "D"], "type": "MSQ"},
            {"qid": 3, "question": "What is 10+10 in Python?", "answer": ["20"], "type": "CAT"}
        ]
    }

def mock_llm_invoke(prompt):
    return MagicMock(content="This is a mock personalized feedback and recommendations.")

@patch.object(get_llm(), 'invoke', side_effect=mock_llm_invoke)
@patch('app.utils.helper_functions.load_questions', side_effect=mock_load_questions)
def test_feedback_recommendations_success(mock_questions, mock_llm, test_client):
    test_payload = {
        "submitted_answers": [
            {"qid": 1, "answer": ["A"]},
            {"qid": 2, "answer": ["B"]},
            {"qid": 3, "answer": ["20"]}
        ]
    }
    response = test_client.post("/api/feedback-recommendations", json=test_payload)
    data = json.loads(response.data)
    
    logging.info("Test: test_feedback_recommendations_success")
    logging.info(f"Expected Output: Feedback and recommendations response")
    logging.info(f"Actual Output: {data}")
    
    assert response.status_code == 200
    assert "performance_summary" in data
    assert "comprehensive_feedback" in data
    assert data["comprehensive_feedback"] == "This is a mock personalized feedback and recommendations."
    logging.info("Result: Success\n")

def test_feedback_recommendations_invalid_payload(test_client):
    test_payload = {"submitted_answers": "invalid_data"}  # Not a list
    response = test_client.post("/api/feedback-recommendations", json=test_payload)
    data = json.loads(response.data)
    
    logging.info("Test: test_feedback_recommendations_invalid_payload")
    logging.info(f"Expected Output: Error message")
    logging.info(f"Actual Output: {data}")
    
    assert response.status_code == 400
    assert "error" in data
    logging.info("Result: Success\n")
