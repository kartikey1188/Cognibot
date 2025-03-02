from . import *
import traceback
from app.models import db
from flask import current_app as app
from flask import request
from flask_restful import Resource, marshal_with, marshal
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.apis.auth import role_required
from app.models.user import Instructor, Role, Course, InstructorCourses
from app.apis.all_marshals import marshal_instructor, marshal_course

"""
THIS FILE HAS THE FOLLOWING API ENDPOINTS:

1) Get all instructors
2) Get an individual instructor
3) Delete an individual instructor
4) Update an individual instructor
5) Get all courses assigned to an instructor
6) Assign an instructor to a course
7) Remove an instructor from a course
"""

class GetAllInstructors(Resource):  # Get all instructors
    @marshal_with(marshal_instructor)
    def get(self):
        instructors = Instructor.query.all()
        return instructors, 200

class InstructorResource(Resource):
    def get(self, instructor_id):  # Get an individual instructor
        instructor = Instructor.query.filter(Instructor.id == instructor_id).first()
        if not instructor:
            return {"message": "Instructor not found"}, 404
        return marshal(instructor,marshal_instructor), 200

    def delete(self, instructor_id):  # Delete an individual instructor
        instructor = Instructor.query.filter(Instructor.id == instructor_id).first()
        if not instructor:
            return {"message": "Instructor not found"}, 404
        try:
            db.session.delete(instructor)
            db.session.commit()
            return {"message": "Instructor deleted successfully"}, 200
        except Exception as e:
            db.session.rollback()
            app.logger.error(f"Exception occurred: {e}")
            app.logger.error(traceback.format_exc())
            return {"Error": "Failed to delete instructor"}, 500
        
    @jwt_required()
    def put(self, instructor_id):  # Update an individual instructor
        instructor = Instructor.query.filter(Instructor.id==instructor_id).first()
        current_user_id = get_jwt_identity()
        if not instructor or instructor.user.id != current_user_id:
            return {"message": "Unauthorized or Instructor not found"}, 403
        
        data = request.get_json()
        if "name" in data and data["name"].strip():
            instructor.user.name = data["name"].strip()
        if "email" in data and data["email"].strip():
            check = Instructor.query.filter(Instructor.user.email == data['email']).first()
            if check:
                return {"Error": "User with this email already exists"}, 400
            else:
                instructor.user.email = data['email'].strip()
        if "description" in data and data["description"].strip():
            instructor.description = data["description"].strip()
        
        try:
            db.session.commit()
            return {"message": "Instructor details updated successfully"}, 200
        except Exception as e:
            db.session.rollback()
            app.logger.error(f"Exception occurred: {e}")
            app.logger.error(traceback.format_exc())
            return {"Error": "Failed to update instructor"}, 500

class InstructorCoursesResource(Resource):
    @marshal_with(marshal_course)
    def get(self, instructor_id):  # Get all courses taught by a particular instructor
        instructor = Instructor.query.filter(Instructor.id == instructor_id).first()
        if not instructor:
            return {"message": "Instructor not found"}, 404
        return instructor.courses, 200

    def post(self, instructor_id, course_id):  # Assign an instructor to a course
        instructor = Instructor.query.filter(Instructor.id == instructor_id).first()
        course = Course.query.filter(Course.course_id == course_id).first()
        
        if not instructor or not course:
            return {"message": "Instructor or Course not found"}, 404
        
        existing_assignment = InstructorCourses.query.filter(InstructorCourses.instructor_id == instructor_id, InstructorCourses.course_id == course_id).first()
        if existing_assignment:
            return {"message": "Instructor is already assigned to this course"}, 400
        
        instructor.courses.append(course)
        try:
            db.session.commit()
            return {"message": "Instructor assigned to course successfully"}, 201
        except Exception as e:
            db.session.rollback()
            app.logger.error(f"Exception occurred: {e}")
            app.logger.error(traceback.format_exc())
            return {"Error": "Could not assign instructor to course"}, 500

    def delete(self, instructor_id, course_id):  # Remove an instructor from a course
        instructor_course = InstructorCourses.query.filter(InstructorCourses.instructor_id == instructor_id, InstructorCourses.course_id == course_id).first()
        if not instructor_course:
            return {"message": "Assignment record not found"}, 404
        try:
            db.session.delete(instructor_course)
            db.session.commit()
            return {"message": "Instructor removed from course successfully"}, 200
        except Exception as e:
            db.session.rollback()
            app.logger.error(f"Exception occurred: {e}")
            app.logger.error(traceback.format_exc())
            return {"Error": "Could not remove instructor from course"}, 500

api.add_resource(GetAllInstructors, "/all_instructors")
api.add_resource(InstructorResource, "/instructor/<int:instructor_id>")
api.add_resource(InstructorCoursesResource, "/instructor/<int:instructor_id>/courses", "/instructor/<int:instructor_id>/course/<int:course_id>")
