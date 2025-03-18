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
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "test_assignment_feedback_documentation.md")

# Ensure output directory exists (but don't delete it)
if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

def write_test_doc(title, endpoint, method, inputs, expected, actual, result):
    if not os.path.exists(OUTPUT_FILE) or os.stat(OUTPUT_FILE).st_size == 0:
        with open(OUTPUT_FILE, 'a') as f:
            f.write(f"## **Endpoint Being Tested:** http://127.0.0.1:5000/assignment_feedback\n\n")
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

def test_successful_code_feedback(client):
    payload = {
        "user_id": 1,
        "code": "def greet(name):\n    print(f'Hello, {name}')\n\ngreet('World')"
    }

    response = client.post("/assignment_feedback", json=payload)
    data = response.get_json()

    expected_status = 200
    result = "Success" if response.status_code == expected_status and "feedback" in data else "Failed"

    write_test_doc(
        title="***Case:*** *Successful execution and feedback generation*",
        endpoint="http://127.0.0.1:5000/assignment_feedback",
        method="POST",
        inputs=json.dumps(payload, indent=2),
        expected="HTTP Status Code: 200 and JSON with 'execution_result' and 'feedback'",
        actual=f"HTTP Status Code: {response.status_code}\nJSON: {json.dumps(data)}",
        result=result
    )

    assert response.status_code == 200
    assert "execution_result" in data
    assert "feedback" in data

def test_code_with_syntax_error(client):
    payload = {
        "user_id": 2,
        "code": "def add(a, b)\n    return a + b\n\nprint(add(5, 3))"
    }

    response = client.post("/assignment_feedback", json=payload)
    data = response.get_json()

    expected_status = 200
    result = "Success" if response.status_code == expected_status and "error" in data else "Failed"

    write_test_doc(
        title="***Case:*** *Code with syntax error (missing colon)*",
        endpoint="http://127.0.0.1:5000/assignment_feedback",
        method="POST",
        inputs=json.dumps(payload, indent=2),
        expected="HTTP Status Code: 200 and JSON with 'error' and 'feedback'",
        actual=f"HTTP Status Code: {response.status_code}\nJSON: {json.dumps(data)}",
        result=result
    )

    assert response.status_code == 200
    assert "error" in data
    assert "feedback" in data

def test_empty_code_submission(client):
    payload = {
        "user_id": 3,
        "code": ""
    }

    response = client.post("/assignment_feedback", json=payload)
    data = response.get_json()

    expected_status = 400
    result = "Success" if response.status_code == expected_status else "Failed"

    write_test_doc(
        title="***Case:*** *Empty code submission*",
        endpoint="http://127.0.0.1:5000/assignment_feedback",
        method="POST",
        inputs=json.dumps(payload, indent=2),
        expected="HTTP Status Code: 400 and error message",
        actual=f"HTTP Status Code: {response.status_code}\nJSON: {json.dumps(data)}",
        result=result
    )

    assert response.status_code == 400
    assert data and "error" in data

def test_missing_fields(client):
    payload = {
        "code": "print('Hello')"
        # user_id is missing
    }

    response = client.post("/assignment_feedback", json=payload)
    data = response.get_json()

    expected_status = 400
    result = "Success" if response.status_code == expected_status else "Failed"

    write_test_doc(
        title="***Case:*** *Missing required field: user_id*",
        endpoint="http://127.0.0.1:5000/assignment_feedback",
        method="POST",
        inputs=json.dumps(payload, indent=2),
        expected="HTTP Status Code: 400 and error message about missing user_id",
        actual=f"HTTP Status Code: {response.status_code}\nJSON: {json.dumps(data)}",
        result=result
    )

    assert response.status_code == 400
    assert data and "message" in data and "user_id" in str(data["message"])
