from flask_restful import Api
from flask_jwt_extended import JWTManager

jwt = JWTManager()
api = Api()

from . import auth, admin, student, instructor

