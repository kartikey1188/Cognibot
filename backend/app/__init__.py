from flask import Flask
from app.models import db, bcrypt
from flask_restful import Api
from app.apis.auth import UserLogin
from app.apis.user import UserResource
from app.config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    bcrypt.init_app(app)
    api = Api(app)

    # Add resources
    api.add_resource(UserLogin, '/login')
    api.add_resource(UserResource, '/api/users')

    return app