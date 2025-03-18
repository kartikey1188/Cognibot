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
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "test_lecture_summary_documentation.md")

# Ensure output directory exists (but don't delete it)
if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

def write_test_doc(title, endpoint, method, inputs, expected, actual, result):
    if not os.path.exists(OUTPUT_FILE) or os.stat(OUTPUT_FILE).st_size == 0:
        with open(OUTPUT_FILE, 'a') as f:
            f.write(f"## **Endpoint Being Tested:** `http://127.0.0.1:5000/lecture_summary/<int:lecture_id>`\n\n")
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

def test_summary_success(client):
    lecture_id = 1
    response = client.get(f"/lecture_summary/{lecture_id}")
    data = response.get_json()

    expected_status = 200
    result = "Success" if response.status_code == expected_status and "lecture_summary" in data else "Failed"

    write_test_doc(
        title="***Case:*** *Successful summary generation*",
        endpoint=f"http://127.0.0.1:5000/lecture_summary/{lecture_id}",
        method="GET",
        inputs=json.dumps({"lecture_id": lecture_id}, indent=2),
        expected="HTTP Status Code: 200 and JSON with 'lecture_summary'",
        actual=f"HTTP Status Code: {response.status_code}\nJSON: {json.dumps(data)}",
        result=result
    )

    assert response.status_code == 200
    assert "lecture_summary" in data

def test_transcript_not_found(client):
    lecture_id = 99999  # Assuming this ID doesn't exist
    response = client.get(f"/lecture_summary/{lecture_id}")
    data = response.get_json()

    expected_status = 404
    result = "Success" if response.status_code == expected_status else "Failed"

    write_test_doc(
        title="***Case:*** *Transcript not found*",
        endpoint=f"http://127.0.0.1:5000/lecture_summary/{lecture_id}",
        method="GET",
        inputs=json.dumps({"lecture_id": lecture_id}, indent=2),
        expected="HTTP Status Code: 404 and error message",
        actual=f"HTTP Status Code: {response.status_code}\nJSON: {json.dumps(data)}",
        result=result
    )

    assert response.status_code == 404
    assert data and "Error" in data

def test_summary_server_error(client):
    lecture_id = 5  
    response = client.get(f"/lecture_summary/{lecture_id}")
    try:
        data = response.get_json()
    except Exception:
        data = None

    expected_status = 500
    result = "Success" if response.status_code == expected_status else "Failed"

    write_test_doc(
        title="***Case:*** *Internal server error on summary generation*",
        endpoint=f"http://127.0.0.1:5000/lecture_summary/{lecture_id}",
        method="GET",
        inputs=json.dumps({"lecture_id": lecture_id}, indent=2),
        expected="HTTP Status Code: 500 and error message",
        actual=f"HTTP Status Code: {response.status_code}\nJSON: {json.dumps(data)}",
        result=result
    )

    assert response.status_code == 500
    assert data and "Error" in data if isinstance(data, dict) else True
