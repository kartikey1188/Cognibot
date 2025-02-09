from . import *
import traceback
from app.models import db
from app.models.user import *
from flask_restful import reqparse
from flask import current_app as app
from flask import request
from flask_restful import Resource, marshal_with
from flask_jwt_extended import jwt_required
from app.apis.auth import role_required
from app.models.user import Course, Instructor, Student, Role, StudentCourses, InstructorCourses
from app.apis.all_marshals import marshal_course, marshal_student, marshal_instructor

class GetAllCourses(Resource):  # Get all courses
    @marshal_with(marshal_course)
    @jwt_required()
    def get(self):
        courses = Course.query.all()
        return courses, 200

class CourseResource(Resource):
    @marshal_with(marshal_course)
    @jwt_required()
    def get(self, course_id):  # Get an individual course
        course = Course.query.filter(Course.course_id == course_id).first()
        if not course:
            return {"message": "Course not found"}, 404
        return course, 200

    @jwt_required()
    @role_required(Role.ADMIN.value)
    def post(self):  # Create a new course
        parser = reqparse.RequestParser()
        parser.add_argument("course_name", type=str, required=True, help="Course name is required")
        parser.add_argument("course_code", type=str, required=True, help="Course code is required")
        parser.add_argument("level", type=str, required=True, choices=[e.value for e in CourseLevel], help="Invalid level")
        parser.add_argument("type", type=str, required=True, choices=[e.value for e in CourseType], help="Invalid type")
        parser.add_argument("description", type=str, required=False, default="No description")
        args = parser.parse_args()

        if Course.query.filter(Course.course_code==args["course_code"]).first():
            return {"message": "Course with this code already exists"}, 400
        
        if Course.query.filter(Course.course_name==args["course_name"]).first():
            return {"message": "Course with this name already exists"}, 400

        new_course = Course(
            course_name=args["course_name"].strip(),
            course_code=args["course_code"].strip(),
            level=CourseLevel(args["level"]),  
            type=CourseType(args["type"]),  
            description=args["description"].strip() if args["description"] else None,
        )

        try:
            db.session.add(new_course)
            db.session.commit()
            return {"message": "Course created successfully", "course_id": new_course.course_id}, 201
        except Exception as e:
            db.session.rollback()
            app.logger.error(f"Exception occurred: {e}")
            app.logger.error(traceback.format_exc())
            return {"Error": "Failed to create course"}, 500

    @jwt_required()
    @role_required(Role.ADMIN.value)
    def put(self, course_id):  # Update an individual course
        parser = reqparse.RequestParser()
        parser.add_argument("course_name", type=str, required=False)
        parser.add_argument("course_code", type=str, required=False)
        parser.add_argument("level", type=str, choices=[e.value for e in CourseLevel], required=False, help="Invalid level")
        parser.add_argument("type", type=str, choices=[e.value for e in CourseType], required=False, help="Invalid type")
        parser.add_argument("description", type=str, required=False)
        data = parser.parse_args()

        course = Course.query.filter(Course.course_id==course_id).first()
        if not course:
            return {"message": "Course not found"}, 404

        if "course_name" in data and data["course_name"].strip():
            existing_course = Course.query.filter(Course.course_name==data["course_name"], Course.course_id != course.course_id).first()
            if existing_course:
                return {"message": "Course with this name already exists"}, 400
            else:
                course.course_name = data["course_name"].strip()
        if "course_code" in data and data["course_code"].strip():
            existing_course = Course.query.filter(Course.course_code==data["course_code"], Course.course_id != course.course_id).first()
            if existing_course:
                return {"message": "Course with this code already exists"}, 400
            else:
                course.course_code = data["course_code"]
       
        if "level" in data and data["level"] in [e.value for e in CourseLevel]:
            course.level = CourseLevel(data["level"])

        if "type" in data and data["type"] in [e.value for e in CourseType]:
            course.type = CourseType(data["type"])

        if "description" in data and data["description"]:
            course.description = data["description"]

        try:
            db.session.commit()
            return {"message": "Course details updated successfully"}, 200
        except Exception as e:
            db.session.rollback()
            app.logger.error(f"Exception occurred: {e}")
            app.logger.error(traceback.format_exc())
            return {"Error": "Failed to update course"}, 500

    @jwt_required()
    @role_required(Role.ADMIN.value)
    def delete(self, course_id):  # Delete an individual course
        course = Course.query.filter(Course.course_id == course_id).first()
        if not course:
            return {"message": "Course not found"}, 404
        try:
            db.session.delete(course)
            db.session.commit()
            return {"message": "Course deleted successfully"}, 200
        except Exception as e:
            db.session.rollback()
            app.logger.error(f"Exception occurred: {e}")
            app.logger.error(traceback.format_exc())
            return {"Error": "Failed to delete course"}, 500

class CourseStudentsResource(Resource):  # Get all students in a course
    @marshal_with(marshal_student)
    @jwt_required()
    @role_required(Role.ADMIN.value, Role.INSTRUCTOR.value)
    def get(self, course_id):
        course = Course.query.filter(Course.course_id == course_id).first()
        if not course:
            return {"message": "Course not found"}, 404
        return course.students, 200

class CourseInstructorsResource(Resource):  # Get all instructors in a course
    @marshal_with(marshal_instructor)
    @jwt_required()
    def get(self, course_id):
        course = Course.query.filter(Course.course_id == course_id).first()
        if not course:
            return {"message": "Course not found"}, 404
        return course.instructors, 200

api.add_resource(GetAllCourses, "/all_courses")
api.add_resource(CourseResource, "/course", "/course/<int:course_id>")
api.add_resource(CourseStudentsResource, "/course/<int:course_id>/students")
api.add_resource(CourseInstructorsResource, "/course/<int:course_id>/instructors")
