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
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "test_faq_suggestions_documentation.md")

# Ensure output directory exists (but don't delete it)
if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

def write_test_doc(title, endpoint, method, inputs, expected, actual, result):
    if not os.path.exists(OUTPUT_FILE) or os.stat(OUTPUT_FILE).st_size == 0:
        with open(OUTPUT_FILE, 'a') as f:
            f.write(f"## **Endpoint Being Tested:** http://127.0.0.1:5000/faq_suggestions/<lecture_id>\n\n")
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

def test_faq_suggestions_success(client):
    lecture_id = 22  # Replace with valid ID from your Firestore for accurate test
    endpoint = f"/faq_suggestions/{lecture_id}"

    response = client.get(endpoint)
    data = response.get_json()

    expected_status = 200
    result = "Success" if response.status_code == expected_status and "faq_suggestions" in data else "Failed"

    write_test_doc(
        title="***Case:*** *Successful FAQ suggestion retrieval*",
        endpoint=endpoint,
        method="GET",
        inputs=f"lecture_id: {lecture_id}",
        expected="HTTP Status Code: 200 and field 'faq_suggestions' in JSON",
        actual=f"HTTP Status Code: {response.status_code}\nJSON: {json.dumps(data)}",
        result=result
    )

    assert response.status_code == 200
    assert "faq_suggestions" in data

def test_faq_suggestions_no_questions(client):
    lecture_id = 99999  # Use an ID with no questions in Firestore
    endpoint = f"/faq_suggestions/{lecture_id}"

    response = client.get(endpoint)
    data = response.get_json()

    expected_status = 200
    expected_message = "No questions/doubts asked by the students for this lecture."
    result = "Success" if response.status_code == expected_status and expected_message in data.get("faq_suggestions", "") else "Failed"

    write_test_doc(
        title="***Case:*** *Lecture ID with no questions in Firestore*",
        endpoint=endpoint,
        method="GET",
        inputs=f"lecture_id: {lecture_id}",
        expected=f"HTTP Status Code: 200 and message: '{expected_message}'",
        actual=f"HTTP Status Code: {response.status_code}\nJSON: {json.dumps(data)}",
        result=result
    )

    assert response.status_code == 200
    assert expected_message in data.get("faq_suggestions", "")

def test_faq_suggestions_server_error(client):
    lecture_id = "invalid"  # Forcefully pass a string to trigger error
    endpoint = f"/faq_suggestions/{lecture_id}"

    response = client.get(f"/faq_suggestions/{lecture_id}")
    try:
        data = response.get_json()
    except Exception:
        data = None

    expected_status = 500
    result = "Success" if response.status_code == expected_status else "Failed"

    write_test_doc(
        title="***Case:*** *Internal Server Error due to invalid lecture_id type*",
        endpoint=endpoint,
        method="GET",
        inputs=f"lecture_id: {lecture_id}",
        expected="HTTP Status Code: 500 and error message",
        actual=f"HTTP Status Code: {response.status_code}\nJSON: {json.dumps(data)}",
        result=result
    )

    assert response.status_code == 500
    assert data and "Error" in data if isinstance(data, dict) else True
