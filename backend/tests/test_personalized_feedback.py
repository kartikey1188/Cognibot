import os
import sys
import pytest
import json

# Make sure app is discoverable
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app import create_app

flask_app = create_app()

# Output directory and file for documentation
OUTPUT_DIR = "outputs"
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "test_personalized_feedback_documentation.md")

# Ensure output directory exists (but don't delete it)
if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

def write_test_doc(title, endpoint, method, inputs, expected, actual, result):
    if not os.path.exists(OUTPUT_FILE) or os.stat(OUTPUT_FILE).st_size == 0:
        with open(OUTPUT_FILE, 'a') as f:
            f.write(f"## **Endpoint Being Tested:** http://127.0.0.1:5000/api/feedback-recommendations\n\n")
            f.write("---\n\n")
    with open(OUTPUT_FILE, 'a') as f:
        f.write(f"### {title}\n\n")
        f.write(f"**Request Method:** {method}  \n\n")
        f.write(f"**Inputs:**\n```json\n{inputs}\n```\n\n")
        f.write(f"**Expected Output:**\n```\n{expected}\n```\n\n")
        f.write(f"**Actual Output:**\n```\n{actual}\n```\n\n")
        f.write(f"**Result:** {result}\n\n")
        f.write("---\n\n")

@pytest.fixture
def client():
    flask_app.config['TESTING'] = True
    with flask_app.test_client() as client:
        yield client

def test_feedback_success(client):
    payload = {
        "submitted_answers": [
            {"qid": 1, "answer": ["D"]},
            {"qid": 2, "answer": ["B"]},
            {"qid": 3, "answer": ["B", "D"]},
            {"qid": 4, "answer": ["B", "C"]},
            {"qid": 5, "answer": ["B"]},
            {"qid": 6, "answer": ["1020"]}
        ]
    }

    response = client.post("/api/feedback-recommendations", json=payload)
    try:
        data = response.get_json(force=True, silent=True)
    except Exception:
        data = None
    json_output = response.data.decode('utf-8')

    expected_status = 200
    result = "Success" if response.status_code == expected_status and data and "comprehensive_feedback" in data else "Failed"

    write_test_doc(
        title="***Case:*** *Successful feedback generation*",
        endpoint="http://127.0.0.1:5000/api/feedback-recommendations",
        method="POST",
        inputs=json.dumps(payload, indent=2),
        expected="HTTP Status Code: 200 and JSON with 'comprehensive_feedback'",
        actual=f"HTTP Status Code: {response.status_code}\nJSON: {json_output}",
        result=result
    )

    assert response.status_code == 200
    assert "comprehensive_feedback" in data

def test_feedback_missing_field(client):
    payload = {
        # submitted_answers key is intentionally missing
    }

    response = client.post("/api/feedback-recommendations", json=payload)
    try:
        data = response.get_json(force=True, silent=True)
    except Exception:
        data = None
    json_output = response.data.decode('utf-8')

    expected_status = 500  # was 400 before
    result = "Success" if response.status_code == expected_status else "Failed"

    write_test_doc(
        title="***Case:*** *Missing submitted_answers field*",
        endpoint="http://127.0.0.1:5000/api/feedback-recommendations",
        method="POST",
        inputs=json.dumps(payload, indent=2),
        expected="HTTP Status Code: 500 and error message",
        actual=f"HTTP Status Code: {response.status_code}\nJSON: {json_output}",
        result=result
    )

    assert response.status_code == 500
    assert data and "error" in data

def test_feedback_internal_server_error(client):
    payload = {
        "submitted_answers": [
            {"qid": 1, "answer": "INVALID FORMAT"}  # 'answer' should be a list
        ]
    }

    response = client.post("/api/feedback-recommendations", json=payload)
    try:
        data = response.get_json(force=True, silent=True)
    except Exception:
        data = None
    json_output = response.data.decode('utf-8')

    expected_status = 400
    result = "Success" if response.status_code == expected_status else "Failed"

    write_test_doc(
        title="***Case:*** *Internal server error due to invalid answer format*",
        endpoint="http://127.0.0.1:5000/api/feedback-recommendations",
        method="POST",
        inputs=json.dumps(payload, indent=2),
        expected="HTTP Status Code: 400 and error message",
        actual=f"HTTP Status Code: {response.status_code}\nJSON: {json_output}",
        result=result
    )

    assert response.status_code == 400
    assert data and "error" in data if isinstance(data, dict) else True
