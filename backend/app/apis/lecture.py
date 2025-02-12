from . import *
import traceback
from app.models import db
from app.models.user import Course, Lecture
from flask_restful import reqparse
from flask import current_app as app
from flask_restful import Resource, marshal_with
from flask_jwt_extended import jwt_required
from app.apis.all_marshals import marshal_lecture

class GetLecturesByWeek(Resource): # Get all lectures of a particular week of a particular course
    @marshal_with(marshal_lecture)
    @jwt_required()
    def get(self, course_id, week):
        course = Course.query.filter(Course.course_id == course_id).first()
        if not course:
            return {"message": "Course not found"}, 404

        lectures = Lecture.query.filter(Lecture.course_id == course.course_id, Lecture.week == week).all()
        if not lectures:
            return {"message": "No lectures found for this week"}, 404

        return lectures, 200

class GetSpecificLecture(Resource): # Get a specific lecture using the course_code, week and lecture_number
    @marshal_with(marshal_lecture)
    @jwt_required()
    def get(self, course_id, week, lecture_number):
        course = Course.query.filter(Course.course_id == course_id).first()
        if not course:
            return {"message": "Course not found"}, 404

        lecture = Lecture.query.filter(
            Lecture.course_id == course.course_id, 
            Lecture.week == week, 
            Lecture.lecture_number == lecture_number
        ).first()

        if not lecture:
            return {"message": "Lecture not found"}, 404

        return lecture, 200
    
class GetAllLectures(Resource):  # Get all lectures of a specific course
    @marshal_with(marshal_lecture)
    @jwt_required()
    def get(self, course_id):
        course = Course.query.filter(Course.course_id == course_id).first()
        if not course:
            return {"message": "Course not found"}, 404

        lectures = Lecture.query.filter(Lecture.course_id == course.course_id).all()
        if not lectures:
            return {"message": "No lectures found for this course"}, 404

        return lectures, 200

api.add_resource(GetAllLectures, "/lectures/<int:course_id>")
api.add_resource(GetLecturesByWeek, "/lectures/<int:course_id>/<int:week>")
api.add_resource(GetSpecificLecture, "/lecture/<int:course_id>/<int:week>/<int:lecture_number>")
