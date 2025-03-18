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
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "test_query_grading_doc_documentation.md")

# Ensure output directory exists (but don't delete it)
if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

def write_test_doc(title, endpoint, method, inputs, expected, actual, result):
    if not os.path.exists(OUTPUT_FILE) or os.stat(OUTPUT_FILE).st_size == 0:
        with open(OUTPUT_FILE, 'a') as f:
            f.write(f"## **Endpoint Being Tested:** http://127.0.0.1:5000/api/grading/query\n\n")
            f.write("---\n\n")
    with open(OUTPUT_FILE, 'a') as f:
        f.write(f"### {title}\n\n")
        f.write(f"**Request Method:** `{method}`  \n\n")
        f.write(f"**Inputs:**\n```json\n{inputs}\n```\n\n")
        f.write(f"**Expected Output:**\n```\n{expected}\n```\n\n")
        f.write(f"**Actual Output:**\n```\n{actual}\n```\n\n")
        f.write(f"**Result:** `{result}`\n\n")
        f.write("---\n\n")

@pytest.fixture
def client():
    flask_app.config['TESTING'] = True
    with flask_app.test_client() as client:
        yield client

def test_query_success(client):
    payload = {
        "query": "What is the grading criteria for software engineering?",
        "k": 1,
        "score_threshold": 0.6
    }

    response = client.post("/api/grading/query", json=payload)
    data = response.get_json()

    expected_status = 200
    result = "Success" if response.status_code == expected_status and "answer" in data and "documents" in data else "Failed"

    write_test_doc(
        title="***Case:*** *Successful grading document query*",
        endpoint="http://127.0.0.1:5000/api/grading/query",
        method="POST",
        inputs=json.dumps(payload, indent=2),
        expected="HTTP Status Code: 200 and JSON with 'answer' and 'documents'",
        actual=f"HTTP Status Code: {response.status_code}\nJSON: {json.dumps(data)}",
        result=result
    )

    assert response.status_code == 200
    assert "answer" in data
    assert "documents" in data

def test_query_missing_param(client):
    payload = {
        # query is missing
        "k": 1,
        "score_threshold": 0.6
    }

    response = client.post("/api/grading/query", json=payload)
    data = response.get_json()

    expected_status = 400
    result = "Success" if response.status_code == expected_status and "error" in data else "Failed"

    write_test_doc(
        title="***Case:*** *Missing required 'query' parameter*",
        endpoint="http://127.0.0.1:5000/api/grading/query",
        method="POST",
        inputs=json.dumps(payload, indent=2),
        expected="HTTP Status Code: 400 and error message indicating 'Query is required'",
        actual=f"HTTP Status Code: {response.status_code}\nJSON: {json.dumps(data)}",
        result=result
    )

    assert response.status_code == 400
    assert data and "error" in data

def test_query_server_error(client):
    payload = {
        "query": None  # Simulating malformed input
    }

    response = client.post("/api/grading/query", json=payload)
    try:
        data = response.get_json()
    except Exception:
        data = None

    expected_status = 500
    result = "Success" if response.status_code == expected_status else "Failed"

    write_test_doc(
        title="***Case:*** *Internal server error while processing query*",
        endpoint="http://127.0.0.1:5000/api/grading/query",
        method="POST",
        inputs=json.dumps(payload, indent=2),
        expected="HTTP Status Code: 500 and error message",
        actual=f"HTTP Status Code: {response.status_code}\nJSON: {json.dumps(data)}",
        result=result
    )

    assert response.status_code == 500
    assert data and "error" in data if isinstance(data, dict) else True
