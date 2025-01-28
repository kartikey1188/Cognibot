from flask import Flask
from app.models import db
from flask_restful import Api
from app.apis.auth import UserLogin
from app.apis.user import UserResource
from app.config import Config
from firebase_admin import credentials, initialize_app

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    api = Api(app)

    # Firebase Initialization
    # cred = credentials.Certificate(app.config["FIREBASE_CERT_PATH"])
    # initialize_app(cred)

    # Add resources
    api.add_resource(UserLogin, '/login')
    api.add_resource(UserResource, '/api/users')

    return app