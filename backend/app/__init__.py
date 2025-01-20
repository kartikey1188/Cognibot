from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_restful import Api
import os

# Initialize the extensions
db = SQLAlchemy()
migrate = Migrate()
api = Api()

def create_app(config_class='Config'):
    # Create the Flask app instance
    app = Flask(__name__)

    # Load configurations from the Config class
    app.config.from_object(config_class)

    # Initialize the extensions with the app
    db.init_app(app)
    migrate.init_app(app, db)
    api.init_app(app)

    # Register Blueprints for API routes
    from .apis import api_bp  # Assuming you have created an 'apis' blueprint
    app.register_blueprint(api_bp, url_prefix='/api')

    # Any other setup, like CORS, middleware, etc.

    return app
