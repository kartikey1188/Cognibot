from flask import Flask
from app.models import db, bcrypt
from app.apis import *
from app.apis.auth import UserLogin
from app.apis.user import UserResource
from app.config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    bcrypt.init_app(app)
    api.init_app(app)
    jwt.init_app(app)

    # Add resources
    api.add_resource(UserLogin, '/login')
    api.add_resource(UserResource, '/api/users')

    return app