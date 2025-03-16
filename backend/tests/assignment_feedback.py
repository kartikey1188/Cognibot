import os
import sys
import pytest
import logging
from unittest.mock import patch
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from app import create_app, db
from flask import json

# Configure logging
logging.basicConfig(filename="test_results.log", level=logging.INFO, format="%(asctime)s - %(message)s")

@pytest.fixture(scope='module')
def test_client():
    """Creates a Flask test client."""
    flask_app = create_app()
    with flask_app.test_client() as testing_client:
        with flask_app.app_context():
            db.create_all()
            yield testing_client
            db.session.remove()
            db.drop_all()

def mock_ai_feedback(prompt):
    """Mock AI feedback response."""
    return type("MockAIResponse", (), {"content": "This is a mock AI feedback response."})()

@patch("app.apis.assignment_feedback.llm.invoke", side_effect=mock_ai_feedback)
def test_code_execution_success(mock_ai, test_client):
    """Test successful execution of Python code."""
    response = test_client.post(
        "/assignment_feedback",
        json={"user_id": 1, "code": "print('Hello, Test!')"}
    )
    data = json.loads(response.data)

    logging.info("Test: test_code_execution_success")
    logging.info("Expected Output: {'execution_result': 'Hello, Test!', 'feedback': 'Mocked AI feedback'}")
    logging.info(f"Actual Output: {data}")

    assert response.status_code == 200
    assert data["execution_result"] == "Hello, Test!"
    assert "feedback" in data
    assert data["feedback"] == "This is a mock AI feedback response."
    logging.info("Result: Success\n")

def test_code_execution_syntax_error(test_client):
    """Test handling of syntax errors."""
    response = test_client.post(
        "/assignment_feedback",
        json={"user_id": 2, "code": "print('Unclosed String"}
    )
    data = json.loads(response.data)

    logging.info("Test: test_code_execution_syntax_error")
    logging.info("Expected Output: SyntaxError response")
    logging.info(f"Actual Output: {data}")

    assert response.status_code == 200
    assert data["error"]["type"] == "SyntaxError"
    assert "feedback" in data
    logging.info("Result: Success\n")

def test_code_execution_runtime_error(test_client):
    """Test handling of runtime errors like division by zero."""
    response = test_client.post(
        "/assignment_feedback",
        json={"user_id": 3, "code": "x = 10 / 0"}
    )
    data = json.loads(response.data)

    logging.info("Test: test_code_execution_runtime_error")
    logging.info("Expected Output: ZeroDivisionError response")
    logging.info(f"Actual Output: {data}")

    assert response.status_code == 200
    assert data["error"]["type"] == "ZeroDivisionError"
    assert "feedback" in data
    logging.info("Result: Success\n")

def test_empty_code_submission(test_client):
    """Test API response for empty code input."""
    response = test_client.post(
        "/assignment_feedback",
        json={"user_id": 4, "code": ""}
    )
    data = json.loads(response.data)

    logging.info("Test: test_empty_code_submission")
    logging.info("Expected Output: {'error': 'Code cannot be empty'}")
    logging.info(f"Actual Output: {data}")

    assert response.status_code == 400
    assert data["error"] == "Code cannot be empty"
    logging.info("Result: Success\n")

@patch("app.apis.assignment_feedback.llm.invoke", side_effect=Exception("AI model failed"))
def test_ai_feedback_exception(mock_ai, test_client):
    """Test handling of AI model failure."""
    response = test_client.post(
        "/assignment_feedback",
        json={"user_id": 5, "code": "print('Test AI Failure')"}
    )
    data = json.loads(response.data)

    logging.info("Test: test_ai_feedback_exception")
    logging.info("Expected Output: AI model failure handling")
    logging.info(f"Actual Output: {data}")

    assert response.status_code == 500
    assert "Error" in data
    assert data["Error"] == "Failed to process request"
    logging.info("Result: Success\n")
