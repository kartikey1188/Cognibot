import os
import sys
import pytest
import json

# Ensure app is discoverable
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app import create_app
from app.models.user import db, User, Instructor, Course, InstructorCourses  # Ensure all models are imported

# Added test configuration to use an in-memory database
test_config = {
    'TESTING': True,
    'SQLALCHEMY_DATABASE_URI': 'sqlite:///:memory:',
    'SQLALCHEMY_TRACK_MODIFICATIONS': False
}
flask_app = create_app(test_config)

# Output directory and file for documentation
OUTPUT_DIR = "outputs"
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "test_instructor_documentation.md")

# Ensure output directory exists
if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

def write_test_doc(title, endpoint, method, inputs, expected, actual, result):
    with open(OUTPUT_FILE, 'a') as f:
        f.write(f"## **Endpoint Being Tested:** `{endpoint}`\n\n")
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

def create_instructor(name, email, description="No description provided."):
    """Helper function to create an instructor with a user."""
    user = User(name=name, email=email, role="INSTRUCTOR")
    user.set_password("password123")  # Set a dummy password
    instructor = Instructor(user=user, description=description)
    db.session.add(user)
    db.session.add(instructor)
    db.session.commit()
    db.session.refresh(instructor)  # Ensure the instructor is bound to the session
    return instructor

def create_course(course_name, course_code, level, type, description="No description provided."):
    """Helper function to create a course."""
    course = Course(
        course_name=course_name,
        course_code=course_code,
        level=level,
        type=type,
        description=description
    )
    db.session.add(course)
    db.session.commit()
    db.session.refresh(course)  # Ensure the course is bound to the session
    return course

def test_get_all_instructors(client):
    with flask_app.app_context():
        create_instructor(name="John Doe", email="john.doe@example.com")
        create_instructor(name="Jane Smith", email="jane.smith@example.com")

    response = client.get("/all_instructors")
    data = response.get_json()

    expected_status = 200
    result = "Success" if response.status_code == expected_status and isinstance(data, list) else "Failed"

    write_test_doc(
        title="***Case:*** *Get all instructors*",
        endpoint="http://127.0.0.1:5000/all_instructors",
        method="GET",
        inputs=json.dumps({}, indent=2),
        expected="HTTP Status Code: 200 and a list of instructors",
        actual=f"HTTP Status Code: {response.status_code}\nJSON: {json.dumps(data)}",
        result=result
    )

    assert response.status_code == 200
    assert isinstance(data, list)

def test_get_individual_instructor(client):
    with flask_app.app_context():
        instructor = create_instructor(name="John Doe", email="john.doe@example.com")
        instructor_id = instructor.id

    response = client.get(f"/instructor/{instructor_id}")
    data = response.get_json()

    expected_status = 200
    result = "Success" if response.status_code == expected_status else "Failed"

    write_test_doc(
        title="***Case:*** *Get an individual instructor*",
        endpoint=f"http://127.0.0.1:5000/instructor/{instructor_id}",
        method="GET",
        inputs=json.dumps({}, indent=2),
        expected="HTTP Status Code: 200 and instructor details",
        actual=f"HTTP Status Code: {response.status_code}\nJSON: {json.dumps(data)}",
        result=result
    )

    assert response.status_code == 200

def test_delete_instructor(client):
    with flask_app.app_context():
        instructor = create_instructor(name="John Doe", email="john.doe@example.com")
        instructor_id = instructor.id

    response = client.delete(f"/instructor/{instructor_id}")
    data = response.get_json()

    expected_status = 200
    result = "Success" if response.status_code == expected_status else "Failed"

    write_test_doc(
        title="***Case:*** *Delete an individual instructor*",
        endpoint=f"http://127.0.0.1:5000/instructor/{instructor_id}",
        method="DELETE",
        inputs=json.dumps({}, indent=2),
        expected="HTTP Status Code: 200 and instructor deleted successfully",
        actual=f"HTTP Status Code: {response.status_code}\nJSON: {json.dumps(data)}",
        result=result
    )

    assert response.status_code == 200

def test_get_instructor_courses(client):
    with flask_app.app_context():
        instructor = create_instructor(name="John Doe", email="john.doe@example.com")
        course = create_course(
            course_name="Test Course",
            course_code="TC101",
            level="FOUNDATIONAL",
            type="PROGRAMMING"
        )
        instructor_course = InstructorCourses(instructor_id=instructor.id, course_id=course.course_id)
        db.session.add(instructor_course)
        db.session.commit()

        # Refresh the instructor instance to avoid DetachedInstanceError
        db.session.refresh(instructor)

    response = client.get(f"/instructor/{instructor.id}/courses")
    data = response.get_json()

    expected_status = 200
    result = "Success" if response.status_code == expected_status and isinstance(data, list) else "Failed"

    write_test_doc(
        title="***Case:*** *Get all courses assigned to an instructor*",
        endpoint=f"http://127.0.0.1:5000/instructor/{instructor.id}/courses",
        method="GET",
        inputs=json.dumps({}, indent=2),
        expected="HTTP Status Code: 200 and a list of courses",
        actual=f"HTTP Status Code: {response.status_code}\nJSON: {json.dumps(data)}",
        result=result
    )

    assert response.status_code == 200
    assert isinstance(data, list)

def test_assign_instructor_to_course(client):
    with flask_app.app_context():
        instructor = create_instructor(name="John Doe", email="john.doe@example.com")
        course = create_course(
            course_name="Test Course",
            course_code="TC101",
            level="FOUNDATIONAL",
            type="PROGRAMMING"
        )

        # Fix: Keep client.post inside app context to avoid DetachedInstanceError
        response = client.post(f"/instructor/{instructor.id}/course/{course.course_id}")
        data = response.get_json()

        expected_status = 201
        result = "Success" if response.status_code == expected_status else "Failed"

        write_test_doc(
            title="***Case:*** *Assign an instructor to a course*",
            endpoint=f"http://127.0.0.1:5000/instructor/{instructor.id}/course/{course.course_id}",
            method="POST",
            inputs=json.dumps({}, indent=2),
            expected="HTTP Status Code: 201 and instructor assigned successfully",
            actual=f"HTTP Status Code: {response.status_code}\nJSON: {json.dumps(data)}",
            result=result
        )

        assert response.status_code == 201

def test_remove_instructor_from_course(client):
    with flask_app.app_context():
        instructor = create_instructor(name="John Doe", email="john.doe@example.com")
        course = create_course(
            course_name="Test Course",
            course_code="TC101",
            level="FOUNDATIONAL",
            type="PROGRAMMING"
        )
        instructor_course = InstructorCourses(instructor_id=instructor.id, course_id=course.course_id)
        db.session.add(instructor_course)
        db.session.commit()

        # Refresh the instructor and course instances to avoid DetachedInstanceError
        db.session.refresh(instructor)
        db.session.refresh(course)

    response = client.delete(f"/instructor/{instructor.id}/course/{course.course_id}")
    data = response.get_json()

    expected_status = 200
    result = "Success" if response.status_code == expected_status else "Failed"

    write_test_doc(
        title="***Case:*** *Remove an instructor from a course*",
        endpoint=f"http://127.0.0.1:5000/instructor/{instructor.id}/course/{course.course_id}",
        method="DELETE",
        inputs=json.dumps({}, indent=2),
        expected="HTTP Status Code: 200 and instructor removed successfully",
        actual=f"HTTP Status Code: {response.status_code}\nJSON: {json.dumps(data)}",
        result=result
    )

    assert response.status_code == 200
