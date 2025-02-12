from . import *
import traceback
from app.models import db
from flask import current_app as app
from flask import request
from flask_restful import Resource, marshal_with
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.apis.auth import role_required
from app.models.user import Instructor, Role, Course, InstructorCourses
from app.apis.all_marshals import marshal_instructor, marshal_course
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv

load_dotenv()

llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash")

class Testf(Resource):
    def get(self):
        result = llm.invoke("sup bro?")
        return {"message":result.content}, 200
    
api.add_resource(Testf, "/jamjam")