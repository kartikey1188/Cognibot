from enum import Enum
from . import db, bcrypt

class CourseLevel(Enum):
    FOUNDATIONAL = 'Foundational'
    DIPLOMA = 'Diploma'
    DEGREE = 'Degree'

class CourseType(Enum):
    DATA_SCIENCE = 'Data Science'
    PROGRAMMING = 'Programming'
    MISCELLANEOUS = 'Miscellaneous'

class GradeObtained(Enum):
    NA = 'NA'  
    S = 'S'    
    A = 'A'    
    B = 'B'    
    C = 'C'    
    D = 'D'    
    E = 'E'    
    
class Role(Enum):
    STUDENT = 'student'
    INSTRUCTOR = 'instructor'
    ADMIN = 'admin'

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    role = db.Column(db.Enum(Role), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)  # Store hashed password

    def set_password(self, password):
        """Hash the password using Flask-Bcrypt and store it."""
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        """Verify password during login."""
        return bcrypt.check_password_hash(self.password_hash, password)
    
    student = db.relationship('Student', back_populates='user', uselist=False, cascade="all, delete-orphan")
    instructor = db.relationship('Instructor', back_populates='user', uselist=False, cascade="all, delete-orphan")



class Student(db.Model):
    __tablename__ = 'student'
    id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), primary_key=True)
    user = db.relationship('User', back_populates='student')
    courses = db.relationship('Course', secondary='student_courses', back_populates='students')

class Instructor(db.Model):
    __tablename__ = 'instructor'
    id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), primary_key=True)
    user = db.relationship('User', back_populates='instructor')
    courses = db.relationship('Course', secondary='instructor_courses', back_populates='instructors') # the courses that this particular instructor teaches
    description = db.Column(db.Text, default="No description provided.") # a description of this instructor, things like educational background or achievements 

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
    #assignments = db.relationship('Assignment', back_populates='course', cascade="all, delete-orphan") 

# class Assignment(db.Model):  # Represents an assignment associated with a course.
#     __tablename__ = 'assignment'
#     assignment_id = db.Column(db.Integer, primary_key=True, autoincrement=True)  
#     title = db.Column(db.String(300), nullable=False)  # the title of the assignment
#     description = db.Column(db.Text, nullable=True)  # a description for the assignment
#     due_date = db.Column(db.DateTime, nullable=False)  # deadline for the assignment submission
#     course_id = db.Column(db.Integer, db.ForeignKey('course.course_id', ondelete="CASCADE"), nullable=False)  # foreign key linking the assignment to a Course
#     course = db.relationship('Course', back_populates='assignments')  # relationship to the Course model

class InstructorCourses(db.Model): # Implements a many-to-many relationship between Instructor and Course.
    __tablename__ = 'instructor_courses'
    instructor_id = db.Column(db.Integer, db.ForeignKey('instructor.id', ondelete="CASCADE"), primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('course.course_id', ondelete="CASCADE"), primary_key=True)

class StudentCourses(db.Model): # Implements a many-to-many relationship between Student and Course.
    __tablename__ = 'student_courses'
    student_id = db.Column(db.Integer, db.ForeignKey('student.id', ondelete="CASCADE"), primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('course.course_id', ondelete="CASCADE"), primary_key=True)
    grade_obtained = db.Column(db.Enum(GradeObtained), nullable=False, default=GradeObtained.NA) # this is the grade obtained by a particular student in a particular course - grade_obtained by default is NA, but can be changed to S,A,B,C and so on (after the result)

