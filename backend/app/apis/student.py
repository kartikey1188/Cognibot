from . import *
import traceback
from app.models import db
from flask import current_app as app
from flask import request
from flask_restful import Resource, marshal_with
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.apis.auth import role_required
from app.models.user import Student, Role, Course, StudentCourses
from app.apis.all_marshals import marshal_student, marshal_course, marshal_student_course


class GetAllStudents(Resource): # get all students
    @marshal_with(marshal_student)
    @jwt_required()
    @role_required(Role.ADMIN, Role.INSTRUCTOR)
    def get(self):
        students = Student.query.all()
        return students, 200

class StudentResource(Resource): 
    @marshal_with(marshal_student)
    @jwt_required()
    def get(self, student_id): # get an individual student 
        student = Student.query.filter(Student.id==student_id).first()
        if not student:
            return {"message": "Student not found"}, 404
        return student, 200

    @jwt_required()
    @role_required(Role.ADMIN)
    def delete(self, student_id): # delete an individual student
        student = Student.query.filter(Student.id==student_id).first()
        if not student:
            return {"message": "Student not found"}, 404
        try:
            db.session.delete(student)
            db.session.commit()
            return {"message": "Student deleted successfully"}, 200
        except Exception as e:
            db.session.rollback()
            app.logger.error(f"Exception occurred: {e}")
            app.logger.error(traceback.format_exc())
            return {"Error" : "Failed to delete student"}, 500

    @jwt_required()
    @role_required(Role.STUDENT)
    def put(self, student_id): # update an individual student 
        student = Student.query.filter_by(id=student_id).first()
        current_user_id = get_jwt_identity()
        if not student or student.user.id != current_user_id:
            return {"message": "Unauthorized or Student not found"}, 403
        
        data = request.get_json()
        if "name" in data and data["name"].strip():
            student.user.name = data["name"].strip()
        if "email" in data and data["email"].strip():
            check = Student.query.filter(Student.user.email==data['email']).first()
            if check:
                return {"Error":"User with this email already exists"}, 400
            else:
                student.user.email = data['email'].strip()
        try:
            db.session.commit()
            return {"message": "Student details updated successfully"}, 200
        except Exception as e:
            db.session.rollback()
            app.logger.error(f"Exception occurred: {e}")
            app.logger.error(traceback.format_exc())
            return {"Error" : "Failed to update student"}, 500

class StudentCoursesResource(Resource):
    @marshal_with(marshal_course)
    @jwt_required()
    @role_required(Role.STUDENT, Role.ADMIN)
    def get(self, student_id): # get all courses of a particular student 
        student = Student.query.filter(Student.id==student_id).first()
        if not student:
            return {"message": "Student not found"}, 404
        return student.courses, 200

    @jwt_required()
    @role_required(Role.ADMIN)
    def post(self, student_id, course_id): # enroll a particular student into a particular course
        student = Student.query.filter(Student.id==student_id).first()
        course = Course.query.filter(Course.course_id==course_id).first()
        
        if not student or not course:
            return {"message": "Student or Course not found"}, 404
        
        existing_enrollment = StudentCourses.query.filter(StudentCourses.student_id==student_id, StudentCourses.course_id==course_id).first()
        if existing_enrollment:
            return {"message": "Student is already enrolled in this course"}, 400
        
        student.courses.append(course)
        try:
            db.session.commit()
            return {"message": "Student enrolled in course successfully"}, 201
        except Exception as e:
            db.session.rollback()
            app.logger.error(f"Exception occurred: {e}")
            app.logger.error(traceback.format_exc())
            return {"Error" : "Could not enroll this student in course"}, 500
        
    @jwt_required()
    @role_required(Role.ADMIN)
    def delete(self, student_id, course_id): # unenroll a particular student from a particular course
        student_course = StudentCourses.query.filter(StudentCourses.student_id==student_id, StudentCourses.course_id==course_id).first()
        if not student_course:
            return {"message": "Enrollment record not found"}, 404
        try:
            db.session.delete(student_course)
            db.session.commit()
            return {"message": "Student unenrolled from course successfully"}, 200
        except Exception as e:
            db.session.rollback()
            app.logger.error(f"Exception occurred: {e}")
            app.logger.error(traceback.format_exc())
            return {"Error" : "Could not unenroll this student from course"}, 500

class StudentGradeInACourse(Resource):
    @jwt_required()
    def get(self, student_id, course_id): # the grade obtained by a particular student in a particular course
        student_course = StudentCourses.query.filter(StudentCourses.student_id==student_id, StudentCourses.course_id==course_id).first()
        if not student_course:
            return {"message": "Enrollment record not found"}, 404
        return {"grade_obtained": student_course.grade_obtained.value}, 200


api.add_resource(GetAllStudents, "/all_students")
api.add_resource(StudentResource, "/student/<int:student_id>")
api.add_resource(StudentCoursesResource, "/student/<int:student_id>/courses", "/student/<int:student_id>/course/<int:course_id>")
api.add_resource(StudentGradeInACourse, "/student/<int:student_id>/course/<int:course_id>/grade")

