from flask_restful import Resource
from . import api
from app.utils.helper_functions import load_questions

class Questions(Resource):
    def get(self):
        data = load_questions()
        return data['questions'], 200

api.add_resource(Questions, '/api/questions')