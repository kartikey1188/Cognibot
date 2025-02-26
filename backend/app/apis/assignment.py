from flask_restful import Resource
import json
from . import api
from pathlib import Path

questions_path = Path(__file__).resolve().parent.parent.parent / 'data' / 'questions' / 'python_w1.json'

def load_questions(path=questions_path):
    with open(path, 'r') as f:
        return json.load(f)


class Questions(Resource):
    def get(self):
        data = load_questions()
        return data['questions'], 200

api.add_resource(Questions, '/api/questions')
