from . import *
import traceback
from app.models import db
from app.models.user import Course, Lecture
from flask_restful import reqparse
from flask import current_app as app
from flask_restful import Resource, marshal_with
from flask_jwt_extended import jwt_required
from app.apis.all_marshals import marshal_lecture

"""
THIS FILE HAS THE FOLLOWING API ENDPOINTS:

1) Get all lectures of a particular week of a particular course
2) Get a specific lecture using the course_id, week and lecture number
3) Get a specific lecture using the lecture_id
4) Get all lectures of a specific course
"""

class GetLecturesByWeek(Resource): # Get all lectures of a particular week of a particular course
    @marshal_with(marshal_lecture)
    def get(self, course_id, week):
        course = Course.query.filter(Course.course_id == course_id).first()
        if not course:
            return {"message": "Course not found"}, 404

        lectures = Lecture.query.filter(Lecture.course_id == course.course_id, Lecture.week == week).all()
        if not lectures:
            return {"message": "No lectures found for this week"}, 404

        return lectures, 200
    
class GetSpecificLectureByNumber(Resource): # Get a specific lecture using the course_id, week and lecture_number
    @marshal_with(marshal_lecture)
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
    
class GetSpecificLectureByID(Resource): # Get a specific lecture using lecture_id
    @marshal_with(marshal_lecture)
    def get(self, lecture_id):

        lecture = Lecture.query.filter(Lecture.lecture_id == lecture_id).first()

        if not lecture:
            return {"message": "Lecture not found"}, 404

        return lecture, 200
    
    
class GetAllLectures(Resource):  # Get all lectures of a specific course
    @marshal_with(marshal_lecture)
    def get(self, course_id):
        course = Course.query.filter(Course.course_id == course_id).first()
        if not course:
            return {"message": "Course not found"}, 404

        lectures = Lecture.query.filter(Lecture.course_id == course.course_id).all()
        if not lectures:
            return {"message": "No lectures found for this course"}, 404

        return lectures, 200

api.add_resource(GetAllLectures, "/lectures/<int:course_id>") # Get all lectures of a specific course
api.add_resource(GetLecturesByWeek, "/lectures/<int:course_id>/<int:week>") # Get all lectures of a particular week of a particular course
api.add_resource(GetSpecificLectureByNumber, "/get_lecture_by_number/<int:course_id>/<int:week>/<int:lecture_number>") # Get a specific lecture using the course_id, week and lecture_number
api.add_resource(GetSpecificLectureByID, "/get_lecture_by_id/<int:lecture_id>") #  Get a specific lecture using the lecture_id



