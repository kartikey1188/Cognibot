import os
import sys
import pytest
import json

# Ensure app is discoverable
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app import create_app
from app.models.user import db, Course, CourseLevel, CourseType, StudentCourses  # Make sure Course is imported

# Added test configuration to use an in-memory database
test_config = {
    'TESTING': True,
    'SQLALCHEMY_DATABASE_URI': 'sqlite:///:memory:',
    'SQLALCHEMY_TRACK_MODIFICATIONS': False
}
flask_app = create_app(test_config)

# Output directory and file for documentation
OUTPUT_DIR = "outputs"
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "test_course_documentation.md")

# Ensure output directory exists
if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

def write_test_doc(title, endpoint, method, inputs, expected, actual, result):
    with open(OUTPUT_FILE, 'a') as f:
        f.write(f"### **Endpoint Being Tested:** `{endpoint}`\n\n")
        f.write("---\n\n")
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
    flask_app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    flask_app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    with flask_app.app_context():
        db.create_all()

    with flask_app.test_client() as client:
        yield client

    with flask_app.app_context():
        db.session.remove()
        db.drop_all()

def test_course_listing_success(client):
    with flask_app.app_context():
        course_1 = Course(course_name="Programming in Python", course_code="BSCS1002", level="FOUNDATIONAL", type="PROGRAMMING")
        course_2 = Course(course_name="Software Enginnering", course_code="BSCS3001", level="DEGREE", type="PROGRAMMING")
        course_3 = Course(course_name="Machine Learning Practice", course_code="BSCS2008", level="DIPLOMA", type="DATA_SCIENCE")
        db.session.add(course_1)
        db.session.add(course_2)
        db.session.add(course_3)
        db.session.commit()
    response = client.get("/all_courses")
    data = response.get_json()

    expected_status = 200
    result = "Success" if response.status_code == expected_status else "Failed"

    write_test_doc(
        title="***Case:*** *Successful course listing*",
        endpoint="http://127.0.0.1:5000/all_courses",
        method="GET",
        inputs=json.dumps({}, indent=2),
        expected="HTTP Status Code: 200 and a list of courses",
        actual=f"HTTP Status Code: {response.status_code}\nResponse: {response.data.decode('utf-8')}",
        result=result
    )

    assert response.status_code == 200
    assert isinstance(data, list)

def test_course_invalid_method(client):
    response = client.post("/all_courses", json={})  # Send empty JSON
    try:
        data = response.get_json()
    except Exception:
        data = None

    expected_status = 405
    result = "Success" if response.status_code == expected_status else "Failed"

    write_test_doc(
        title="***Case:*** *Invalid method used for course listing*",
        endpoint="http://127.0.0.1:5000/all_courses",
        method="POST",
        inputs=json.dumps({}, indent=2),
        expected="HTTP Status Code: 405 and method not allowed error",
        actual=f"HTTP Status Code: {response.status_code}\nJSON: {json.dumps(data)}",
        result=result
    )

    assert response.status_code == 405

def test_create_course(client):
    payload = {
        "course_name": "Test Course",
        "course_code": "TC101",
        "level": "Diploma",
        "type": "Programming",
        "description": "This is a test course."
    }
    response = client.post("/course", json=payload)
    data = response.get_json()

    expected_status = 201
    result = "Success" if response.status_code == expected_status else "Failed"

    write_test_doc(
        title="***Case:*** *Create a new course*",
        endpoint="http://127.0.0.1:5000/course",
        method="POST",
        inputs=json.dumps(payload, indent=2),
        expected="HTTP Status Code: 201 and course created successfully",
        actual=f"HTTP Status Code: {response.status_code}\nJSON: {json.dumps(data)}",
        result=result
    )

    assert response.status_code == 201
    assert "course_id" in data

def test_get_course(client):
    with flask_app.app_context():
        course = Course(course_name="Machine Learning Practice", course_code="BSCS2008", level="DIPLOMA", type="DATA_SCIENCE")
        db.session.add(course)
        db.session.commit()
        course_id = course.course_id

    response = client.get(f"/course/{course_id}")
    data = response.get_json()

    expected_status = 200
    result = "Success" if response.status_code == expected_status else "Failed"

    write_test_doc(
        title="***Case:*** *Get an individual course*",
        endpoint=f"http://127.0.0.1:5000/course/{course_id}",
        method="GET",
        inputs=json.dumps({}, indent=2),
        expected="HTTP Status Code: 200 and course details",
        actual=f"HTTP Status Code: {response.status_code}\nJSON: {json.dumps(data)}",
        result=result
    )

    assert response.status_code == 200

def test_update_course(client):
    with flask_app.app_context():
        course = Course(course_name="Machine Learning Practice", course_code="BSCS2008", level="DIPLOMA", type="DATA_SCIENCE")
        db.session.add(course)
        db.session.commit()
        course_id = course.course_id

    payload = {
        "course_name": "Updated Test Course",
        "description": "Updated description"
    }
    response = client.put(f"/course/{course_id}", json=payload)
    data = response.get_json()

    expected_status = 200
    result = "Success" if response.status_code == expected_status else "Failed"

    write_test_doc(
        title="***Case:*** *Update an existing course*",
        endpoint=f"http://127.0.0.1:5000/course/{course_id}",
        method="PUT",
        inputs=json.dumps(payload, indent=2),
        expected="HTTP Status Code: 200 and course updated successfully",
        actual=f"HTTP Status Code: {response.status_code}\nJSON: {json.dumps(data)}",
        result=result
    )

    assert response.status_code == 200

def test_delete_course(client):
    with flask_app.app_context():
        course = Course(course_name="Machine Learning Practice", course_code="BSCS2008", level="DIPLOMA", type="DATA_SCIENCE")
        db.session.add(course)
        db.session.commit()
        course_id = course.course_id

    response = client.delete(f"/course/{course_id}")
    data = response.get_json()

    expected_status = 200
    result = "Success" if response.status_code == expected_status else "Failed"

    write_test_doc(
        title="***Case:*** *Delete an existing course*",
        endpoint=f"http://127.0.0.1:5000/course/{course_id}",
        method="DELETE",
        inputs=json.dumps({}, indent=2),
        expected="HTTP Status Code: 200 and course deleted successfully",
        actual=f"HTTP Status Code: {response.status_code}\nJSON: {json.dumps(data)}",
        result=result
    )

    assert response.status_code == 200