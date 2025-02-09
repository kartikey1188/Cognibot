from flask_restful import fields

marshal_user = {
    'id': fields.Integer,
    'role': fields.String(attribute=lambda x: x.role.value),
    'name': fields.String,
    'email': fields.String
}

marshal_student = {
    'id': fields.Integer,
    'user': fields.Nested(marshal_user),
    'courses': fields.List(fields.Integer(attribute='course_id'))  # Course IDs 
}

marshal_instructor = {
    'id': fields.Integer,
    'user': fields.Nested(marshal_user),
    'courses': fields.List(fields.Integer(attribute='course_id')),  # Course IDs 
    'description': fields.String
}

marshal_course = {
    'course_id': fields.Integer,
    'course_name': fields.String,
    'course_code': fields.String,
    'description': fields.String,
    'level': fields.String(attribute=lambda x: x.level.value),  # Foundational, Diploma, or Degree
    'type': fields.String(attribute=lambda x: x.type.value),   # Data Science, Programming, or Miscellaneous
    'image': fields.String,
    'instructors': fields.List(fields.Integer(attribute='id')),  # Instructor IDs
    'students': fields.List(fields.Integer(attribute='id')),     # Student IDs
    'assignments': fields.List(fields.Integer(attribute='assignment_id'))  # Assignment IDs
}

marshal_assignment = {
    'assignment_id': fields.Integer,
    'title': fields.String,
    'description': fields.String,
    'due_date': fields.String,  # Date formatted as string
    'course_id': fields.Integer
}

marshal_student_course = {
    'student_id': fields.Integer,
    'course_id': fields.Integer,
    'grade_obtained': fields.String(attribute=lambda x: x.grade_obtained.value)  # Uses GradeObtained enum values
}

marshal_instructor_course = {
    'instructor_id': fields.Integer,
    'course_id': fields.Integer
}