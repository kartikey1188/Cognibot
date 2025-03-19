import os
import sys
import pytest
import json

# Ensure app is discoverable
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app import create_app
from app.models.user import db, User, Student, Course, StudentCourses, GradeObtained, Role

# Added test configuration to use an in-memory database
test_config = {
    'TESTING': True,
    'SQLALCHEMY_DATABASE_URI': 'sqlite:///:memory:',
    'SQLALCHEMY_TRACK_MODIFICATIONS': False
}
flask_app = create_app(test_config)

# Output directory and file for documentation
OUTPUT_DIR = "outputs"
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "test_student_documentation.md")

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

def test_get_all_students(client):
    with flask_app.app_context():
        user_1 = User(name="John Doe", email="john.doe@example.com", role=Role.STUDENT)
        user_1.set_password("password123")
        user_2 = User(name="Jane Smith", email="jane.smith@example.com", role=Role.STUDENT)
        user_2.set_password("password123")
        db.session.add(user_1)
        db.session.add(user_2)
        db.session.commit()

        student_1 = Student(id=user_1.id)
        student_2 = Student(id=user_2.id)
        db.session.add(student_1)
        db.session.add(student_2)
        db.session.commit()

    response = client.get("/all_students")
    data = response.get_json()

    expected_status = 200
    result = "Success" if response.status_code == expected_status and isinstance(data, list) else "Failed"

    write_test_doc(
        title="***Case:*** *Get all students*",
        endpoint="http://127.0.0.1:5000/all_students",
        method="GET",
        inputs=json.dumps({}, indent=2),
        expected="HTTP Status Code: 200 and a list of students",
        actual=f"HTTP Status Code: {response.status_code}\nJSON: {json.dumps(data)}",
        result=result
    )

    assert response.status_code == 200
    assert isinstance(data, list)

def test_get_individual_student(client):
    with flask_app.app_context():
        user = User(name="John Doe", email="john.doe@example.com", role=Role.STUDENT)
        user.set_password("password123")
        db.session.add(user)
        db.session.commit()

        student = Student(id=user.id)
        db.session.add(student)
        db.session.commit()
        student_id = student.id

    response = client.get(f"/student/{student_id}")
    data = response.get_json()

    expected_status = 200
    result = "Success" if response.status_code == expected_status else "Failed"

    write_test_doc(
        title="***Case:*** *Get an individual student*",
        endpoint=f"http://127.0.0.1:5000/student/{student_id}",
        method="GET",
        inputs=json.dumps({}, indent=2),
        expected="HTTP Status Code: 200 and student details",
        actual=f"HTTP Status Code: {response.status_code}\nJSON: {json.dumps(data)}",
        result=result
    )

    assert response.status_code == 200

def test_update_student(client):
    with flask_app.app_context():
        user = User(name="John Doe", email="john.doe@example.com", role=Role.STUDENT)
        user.set_password("password123")
        db.session.add(user)
        db.session.commit()

        student = Student(id=user.id)
        db.session.add(student)
        db.session.commit()
        student_id = student.id

    payload = {
        "name": "Updated Student Name",
        "email": "updated_email@example.com"
    }
    response = client.put(f"/student/{student_id}", json=payload)
    data = response.get_json()

    expected_status = 200
    result = "Success" if response.status_code == expected_status else "Failed"

    write_test_doc(
        title="***Case:*** *Update an individual student*",
        endpoint=f"http://127.0.0.1:5000/student/{student_id}",
        method="PUT",
        inputs=json.dumps(payload, indent=2),
        expected="HTTP Status Code: 200 and student updated successfully",
        actual=f"HTTP Status Code: {response.status_code}\nJSON: {json.dumps(data)}",
        result=result
    )

    assert response.status_code == 200

def test_delete_student(client):
    with flask_app.app_context():
        user = User(name="John Doe", email="john.doe@example.com", role="STUDENT")
        user.set_password("password123")
        db.session.add(user)
        db.session.commit()

        student = Student(id=user.id)
        db.session.add(student)
        db.session.commit()
        student_id = student.id

    response = client.delete(f"/student/{student_id}")
    data = response.get_json()

    expected_status = 200
    result = "Success" if response.status_code == expected_status else "Failed"

    write_test_doc(
        title="***Case:*** *Delete an individual student*",
        endpoint=f"http://127.0.0.1:5000/student/{student_id}",
        method="DELETE",
        inputs=json.dumps({}, indent=2),
        expected="HTTP Status Code: 200 and student deleted successfully",
        actual=f"HTTP Status Code: {response.status_code}\nJSON: {json.dumps(data)}",
        result=result
    )

    assert response.status_code == 200

def test_get_student_courses(client):
    with flask_app.app_context():
        user = User(name="John Doe", email="john.doe@example.com", role="STUDENT")
        user.set_password("password123")
        db.session.add(user)
        db.session.commit()

        student = Student(id=user.id)
        course = Course(course_name="Programming in Python", course_code="BSCS1002", level="FOUNDATIONAL", type="PROGRAMMING")
        db.session.add(student)
        db.session.add(course)
        db.session.commit()
        student_id = student.id

    response = client.get(f"/student/{student_id}/courses")
    data = response.get_json()

    expected_status = 200
    result = "Success" if response.status_code == expected_status and isinstance(data, list) else "Failed"

    write_test_doc(
        title="***Case:*** *Get all courses of a student*",
        endpoint=f"http://127.0.0.1:5000/student/{student_id}/courses",
        method="GET",
        inputs=json.dumps({}, indent=2),
        expected="HTTP Status Code: 200 and a list of courses",
        actual=f"HTTP Status Code: {response.status_code}\nJSON: {json.dumps(data)}",
        result=result
    )

    assert response.status_code == 200
    assert isinstance(data, list)

def test_enroll_student_in_course(client):
    with flask_app.app_context():
        user = User(name="John Doe", email="john.doe@example.com", role="STUDENT")
        user.set_password("password123")
        db.session.add(user)
        db.session.commit()

        student = Student(id=user.id)
        db.session.add(student)

        course = Course(course_name="Programming in Python", course_code="BSCS1002", level="FOUNDATIONAL", type="PROGRAMMING")
        db.session.add(course)
        db.session.commit()

        student_id = student.id
        course_id = course.course_id

    response = client.post(f"/student/{student_id}/course/{course_id}")
    data = response.get_json()

    expected_status = 201
    result = "Success" if response.status_code == expected_status else "Failed"

    write_test_doc(
        title="***Case:*** *Enroll a student in a course*",
        endpoint=f"http://127.0.0.1:5000/student/{student_id}/course/{course_id}",
        method="POST",
        inputs=json.dumps({}, indent=2),
        expected="HTTP Status Code: 201 and student enrolled successfully",
        actual=f"HTTP Status Code: {response.status_code}\nJSON: {json.dumps(data)}",
        result=result
    )

    assert response.status_code == 201

def test_get_student_grade_in_course(client):
    with flask_app.app_context():
        user = User(name="John Doe", email="john.doe@example.com", role=Role.STUDENT)
        user.set_password("password123")
        db.session.add(user)
        db.session.commit()

        student = Student(id=user.id)
        db.session.add(student)

        course = Course(course_name="Programming in Python", course_code="BSCS1002", level="FOUNDATIONAL", type="PROGRAMMING")
        db.session.add(course)
        db.session.commit()

        student_course = StudentCourses(student_id=student.id, course_id=course.course_id, grade_obtained=GradeObtained.A)
        db.session.add(student_course)
        db.session.commit()

        student_id = student.id
        course_id = course.course_id

    response = client.get(f"/student/{student_id}/course/{course_id}/grade")
    data = response.get_json()

    expected_status = 200
    result = "Success" if response.status_code == expected_status else "Failed"

    write_test_doc(
        title="***Case:*** *Get a student's grade in a course*",
        endpoint=f"http://127.0.0.1:5000/student/{student_id}/course/{course_id}/grade",
        method="GET",
        inputs=json.dumps({}, indent=2),
        expected="HTTP Status Code: 200 and grade details",
        actual=f"HTTP Status Code: {response.status_code}\nJSON: {json.dumps(data)}",
        result=result
    )

    assert response.status_code == 200
    assert data["grade_obtained"] == "A"