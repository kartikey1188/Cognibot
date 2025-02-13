from flask_restful import Api
from flask_jwt_extended import JWTManager
import os
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../..")))

jwt = JWTManager()
api = Api()

from . import auth, admin, student, instructor, ai, course, all_marshals, lecture
from backend.data import transcript_generator, vectordb_generator
