from flask import Flask
from app.models import db, bcrypt
from app.apis import *
from app.config import Config
from flask_cors import CORS

def create_app(test_config=None):
    app = Flask(__name__, static_folder='../docs', static_url_path='/static')
    if test_config:
        app.config.from_mapping(test_config)
    else:
        app.config.from_object(Config)

    db.init_app(app)
    bcrypt.init_app(app)
    api.init_app(app)
    jwt.init_app(app)

    # Add resources
    # api.add_resource(UserLogin, '/login')
    # api.add_resource(UserResource, '/api/users')

    return app