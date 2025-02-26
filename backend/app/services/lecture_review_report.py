import traceback
from flask import current_app as app
from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required
from app.models.user import LectureReview, Lecture
from app.models import db
from langchain_google_genai import ChatGoogleGenerativeAI
from app.apis import api