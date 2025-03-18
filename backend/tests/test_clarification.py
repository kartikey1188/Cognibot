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
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "test_clarification_documentation.md")

# Ensure output directory exists (but don't delete it)
if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

def write_test_doc(title, endpoint, method, inputs, expected, actual, result):
    if not os.path.exists(OUTPUT_FILE) or os.stat(OUTPUT_FILE).st_size == 0:
        with open(OUTPUT_FILE, 'a') as f:
            f.write(f"## **Endpoint Being Tested:** http://127.0.0.1:5000/clarification\n\n")
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

def test_clarification_success(client):
    payload = {
        "user_id": 125,
        "quest": "What are variables and literals in Python?"
    }
    response = client.post("/clarification", json=payload)
    data = response.get_json()

    expected_status = 200
    result = "Success" if response.status_code == expected_status and "response" in data else "Failed"

    write_test_doc(
        title="***Case:*** *Successful clarification generation*",
        endpoint="http://127.0.0.1:5000/clarification",
        method="POST",
        inputs=json.dumps(payload, indent=2),
        expected="HTTP Status Code: 200 and JSON with 'response'",
        actual=f"HTTP Status Code: {response.status_code}\nJSON: {json.dumps(data)}",
        result=result
    )

    assert response.status_code == 200
    assert "response" in data

def test_missing_query(client):
    payload = {
        "user_id": 125,
        "quest": ""
    }
    response = client.post("/clarification", json=payload)
    data = response.get_json()

    expected_status = 400
    result = "Success" if response.status_code == expected_status and "Error" in data else "Failed"

    write_test_doc(
        title="***Case:*** *Missing query in request payload*",
        endpoint="http://127.0.0.1:5000/clarification",
        method="POST",
        inputs=json.dumps(payload, indent=2),
        expected="HTTP Status Code: 400 and error message",
        actual=f"HTTP Status Code: {response.status_code}\nJSON: {json.dumps(data)}",
        result=result
    )

    assert response.status_code == 400
    assert data and "Error" in data

def test_clarification_server_error(client):
    # This should be an ID or input that forces some kind of internal failure during agent processing.
    payload = {
        "user_id": -999,  # Invalid or corrupted user session to simulate internal error
        "quest": "This should trigger a server-side failure"
    }
    response = client.post("/clarification", json=payload)
    try:
        data = response.get_json()
    except Exception:
        data = None

    expected_status = 500
    result = "Success" if response.status_code == expected_status else "Failed"

    write_test_doc(
        title="***Case:*** *Internal server error during clarification generation*",
        endpoint="http://127.0.0.1:5000/clarification",
        method="POST",
        inputs=json.dumps(payload, indent=2),
        expected="HTTP Status Code: 500 and error message",
        actual=f"HTTP Status Code: {response.status_code}\nJSON: {json.dumps(data)}",
        result=result
    )

    assert response.status_code == 500
    assert data and "Error" in data if isinstance(data, dict) else True
