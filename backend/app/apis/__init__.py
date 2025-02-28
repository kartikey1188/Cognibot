from flask_restful import Api
from flask_jwt_extended import JWTManager
import os
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../..")))

jwt = JWTManager()
api = Api()

from . import auth, admin, student, instructor, course, all_marshals, lecture, assignment, lecture_feedback
from backend.data import transcript_generator, vectordb_generator
from backend.app.services import lecture_summary, topic_search, clarification,extra_questions,assignment_feedback,lecture_review_report, query_handbook, query_grading_doc, personalized_feedback, faq_suggestions
