from flask import request
from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import db
from app.models.user import LectureReview, Lecture
from app.apis import api

