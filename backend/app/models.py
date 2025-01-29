from flask_sqlalchemy import SQLAlchemy
from enum import Enum

db = SQLAlchemy()

class CourseLevel(Enum):
    FOUNDATIONAL = 'Foundational'
    DIPLOMA = 'Diploma'
    DEGREE = 'Degree'

class CourseType(Enum):
    DATA_SCIENCE = 'Data Science'
    PROGRAMMING = 'Programming'
    MISCELLANEOUS = 'Miscellaneous'
    
class UserType(Enum):
    STUDENT = 'student'
    INSTRUCTOR = 'instructor'
    ADMIN = 'admin'

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    password = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique = True, nullable = False)
    image = db.Column(db.Text) # to store the image path or URL associated with this user
    type = db.Column(db.Enum(UserType), nullable=False) # type can be 'student', 'instructor', or 'admin'
    username = db.Column(db.String(100), nullable=False, unique=True)

    student = db.relationship('Student', uselist=False, back_populates='user', cascade="all, delete-orphan")
    instructor = db.relationship('Instructor', uselist=False, back_populates='user', cascade="all, delete-orphan")
    roles = db.relationship('Role', back_populates='user', secondary='user_roles') # Many-to-many relationship with the Role model via the user_roles association table.

    # flask-security specific columns: (REMOVE JUST THESE TWO LINES IF YOU DON'T WANNA USE FLASK-SECURITY)
    fs_uniquifier = db.Column(db.String, unique=True, nullable=False) # Unique identifier used by Flask-Security to handle token invalidation after password changes.
    active = db.Column(db.Boolean, default=True) # Boolean value indicating if the user's account is active.

class Role(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=False)
    users = db.relationship('User', secondary='user_roles', back_populates='roles')

class UserRoles(db.Model): # Implements a many-to-many relationship between User and Role.
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), primary_key = True)
    role_id = db.Column(db.Integer, db.ForeignKey('role.id', ondelete='CASCADE'), primary_key = True)


class Student(db.Model):
    __tablename__ = 'student'
    id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), primary_key=True)
    user = db.relationship('User', back_populates='student')
    courses = db.relationship('Course', secondary='student_courses', back_populates='students', cascade="all, delete-orphan")

class Instructor(db.Model):
    __tablename__ = 'instructor'
    id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), primary_key=True)
    user = db.relationship('User', back_populates='instructor')
    courses = db.relationship('Course', secondary='instructor_courses', back_populates='instructors') # the courses that this particular instructor teaches
    description = db.Column(db.Text) # a description of this instructor, things like educational background or achievements 

class Course(db.Model): 
    __tablename__ = 'course'
    course_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    course_name = db.Column(db.String(300), nullable=False, unique=True) # for example : Software Engineering
    course_code = db.Column(db.String(50), nullable=False, unique=True) # for example : BSCCS3003
    description = db.Column(db.Text) # a brief description of the course
    level = db.Column(db.Enum(CourseLevel), nullable=False) # level can be 'Foundational' or 'Diploma' or 'Degree'
    type = db.Column(db.Enum(CourseType), nullable=False) # type can be either 'Data Science' or 'Programming' or 'Miscellaneous' 
    image = db.Column(db.String(300)) # whatever image we'd want to associate with the course
    instructors = db.relationship('Instructor', secondary='instructor_courses', back_populates='courses') # the instructors teaching this course
    students = db.relationship('Student', secondary='student_courses', back_populates='courses') # the students enrolled in this course
    assignments = db.relationship('Assignment', back_populates='course', cascade="all, delete-orphan") 

class Assignment(db.Model):  # Represents an assignment associated with a course.
    __tablename__ = 'assignment'
    assignment_id = db.Column(db.Integer, primary_key=True, autoincrement=True)  
    title = db.Column(db.String(300), nullable=False)  # the title of the assignment
    description = db.Column(db.Text, nullable=True)  # a description for the assignment
    due_date = db.Column(db.DateTime, nullable=False)  # deadline for the assignment submission
    course_id = db.Column(db.Integer, db.ForeignKey('course.course_id', ondelete="CASCADE"), nullable=False)  # foreign key linking the assignment to a Course
    course = db.relationship('Course', back_populates='assignments')  # relationship to the Course model

class InstructorCourses(db.Model): # Implements a many-to-many relationship between Instructor and Course.
    __tablename__ = 'instructor_courses'
    instructor_id = db.Column(db.Integer, db.ForeignKey('instructor.id', ondelete="CASCADE"), primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('course.course_id', ondelete="CASCADE"), primary_key=True)

class StudentCourses(db.Model): # Implements a many-to-many relationship between Student and Course.
    __tablename__ = 'student_courses'
    student_id = db.Column(db.Integer, db.ForeignKey('student.id', ondelete="CASCADE"), primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('course.course_id', ondelete="CASCADE"), primary_key=True)
    grade_obtained = db.Column(db.String(50), nullable=False, default='NA') # this is the grade obtained by a particular student in a particular course - grade_obtained by default is NA, but can be changed to S,A,B,C and so on (after the result)
    # can make Enum for grade_obtained as well, haven't done that here at the moment for brevity's sake






