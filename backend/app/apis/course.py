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
from app.apis.all_marshals import marshal_course, marshal_student, marshal_instructor, marshal_lecture

"""
THIS FILE HAS THE FOLLOWING API ENDPOINTS:

1) Get all courses  
2) Get an individual course  
3) Create a new course  
4) Update an individual course  
5) Delete an individual course  
6) Get all students in a course  
7) Get all instructors in a course  
8) Get an individual lecture  
9) Create a new lecture  
10) Update an individual lecture  
11) Delete an individual lecture
"""

class GetAllCourses(Resource):  # Get all courses
    @marshal_with(marshal_course)
    def get(self):
        courses = Course.query.all()
        return courses, 200

class CourseResource(Resource):
    @marshal_with(marshal_course)
    def get(self, course_id):  # Get an individual course
        course = Course.query.filter(Course.course_id == course_id).first()
        if not course:
            return {"message": "Course not found"}, 404
        return course, 200

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

        if "course_name" in data and data["course_name"]:
            existing_course = Course.query.filter(Course.course_name==data["course_name"], Course.course_id != course.course_id).first()
            if existing_course:
                return {"message": "Course with this name already exists"}, 400
            else:
                course.course_name = data["course_name"].strip()
        if "course_code" in data and data["course_code"]:
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
    def get(self, course_id):
        course = Course.query.filter(Course.course_id == course_id).first()
        if not course:
            return {"message": "Course not found"}, 404
        return course.students, 200

class CourseInstructorsResource(Resource):  # Get all instructors in a course
    @marshal_with(marshal_instructor)
    def get(self, course_id):
        course = Course.query.filter(Course.course_id == course_id).first()
        if not course:
            return {"message": "Course not found"}, 404
        return course.instructors, 200
    
class LectureResource(Resource):
    @marshal_with(marshal_lecture)
    def get(self, lecture_id):  # Get an individual lecture
        lecture = Lecture.query.filter(Lecture.lecture_id == lecture_id).first()
        if not lecture:
            return {"message": "Lecture not found"}, 404
        return lecture, 200

    def post(self):  # Create a new lecture
        parser = reqparse.RequestParser()
        parser.add_argument("course_id", type=int, required=True, help="Course ID is required")
        parser.add_argument("week", type=int, required=True, help="Week number is required")
        parser.add_argument("lecture_number", type=int, required=True, help="Lecture number is required")
        parser.add_argument("title", type=str, required=True, help="Lecture title is required")
        parser.add_argument("lecture_link", type=str, required=True, help="Lecture link is required")
        args = parser.parse_args()

        course = Course.query.filter(Course.course_id == args["course_id"]).first()
        if not course:
            return {"message": "Course not found"}, 404
        
        # Ensuring (course_id, week, lecture_number) is unique
        if args["lecture_number"]:
            existing_lecture = Lecture.query.filter_by(course_id=args["course_id"], week=args["week"], lecture_number=args["lecture_number"]).first()
            if existing_lecture:
                return {"message": "A lecture with this course_id, week, and lecture_number already exists"}, 400

        if Lecture.query.filter(Lecture.lecture_link == args["lecture_link"]).first():
            return {"message": "Lecture with this link already exists"}, 400

        new_lecture = Lecture(
            course_id=args["course_id"],
            week=args["week"],
            lecture_number=args["lecture_number"] if args["lecture_number"] else None,
            title=args["title"].strip(),
            lecture_link=args["lecture_link"].strip(),
        )

        try:
            db.session.add(new_lecture)
            db.session.commit()
            return {"message": "Lecture created successfully", "lecture_id": new_lecture.lecture_id}, 201
        except Exception as e:
            db.session.rollback()
            app.logger.error(f"Exception occurred: {e}")
            app.logger.error(traceback.format_exc())
            return {"Error": "Failed to create lecture"}, 500

    def put(self, lecture_id):  # Update an individual lecture
        parser = reqparse.RequestParser()
        parser.add_argument("week", type=int, required=False)
        parser.add_argument("lecture_number", type=int, required=False)
        parser.add_argument("title", type=str, required=False)
        parser.add_argument("lecture_link", type=str, required=False)
        data = parser.parse_args()

        lecture = Lecture.query.filter(Lecture.lecture_id == lecture_id).first()
        if not lecture:
            return {"message": "Lecture not found"}, 404

        if "title" in data and data["title"]:
            lecture.title = data["title"].strip()

        if "lecture_link" in data and data["lecture_link"]:
            existing_lecture = Lecture.query.filter(Lecture.lecture_link == data["lecture_link"], Lecture.lecture_id != lecture.lecture_id).first()
            if existing_lecture:
                return {"message": "Lecture with this link already exists"}, 400
            else:
                lecture.lecture_link = data["lecture_link"].strip()

        if "week" in data and data["week"]:
            lecture.week = data["week"]

        if "lecture_number" in data and data["lecture_number"]:
            lecture.lecture_number = data["lecture_number"]

        # Ensuring (course_id, week, lecture_number) is unique
        if Lecture.query.filter_by(course_id=lecture.course_id, week=lecture.week, lecture_number=lecture.lecture_number).filter(Lecture.lecture_id != lecture.lecture_id).first():
            return {"message": "A lecture with this number already exists for the given course and week"}, 400

        try:
            db.session.commit()
            return {"message": "Lecture details updated successfully"}, 200
        except Exception as e:
            db.session.rollback()
            app.logger.error(f"Exception occurred: {e}")
            app.logger.error(traceback.format_exc())
            return {"Error": "Failed to update lecture"}, 500

    def delete(self, lecture_id):  # Delete an individual lecture
        lecture = Lecture.query.filter(Lecture.lecture_id == lecture_id).first()
        if not lecture:
            return {"message": "Lecture not found"}, 404
        try:
            db.session.delete(lecture)
            db.session.commit()
            return {"message": "Lecture deleted successfully"}, 200
        except Exception as e:
            db.session.rollback()
            app.logger.error(f"Exception occurred: {e}")
            app.logger.error(traceback.format_exc())
            return {"Error": "Failed to delete lecture"}, 500


api.add_resource(LectureResource, "/lecture", "/lecture/<int:lecture_id>")
api.add_resource(GetAllCourses, "/all_courses")
api.add_resource(CourseResource, "/course", "/course/<int:course_id>")
api.add_resource(CourseStudentsResource, "/course/<int:course_id>/students")
api.add_resource(CourseInstructorsResource, "/course/<int:course_id>/instructors")
