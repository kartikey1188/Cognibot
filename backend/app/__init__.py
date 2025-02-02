from flask import Flask
from app.models import db, bcrypt
from app.apis import *
from app.config import Config
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    bcrypt.init_app(app)
    api.init_app(app)
    jwt.init_app(app)
    CORS(app, origins=["http://localhost:5173"], supports_credentials=True) 

    # Add resources
    # api.add_resource(UserLogin, '/login')
    # api.add_resource(UserResource, '/api/users')

    return app