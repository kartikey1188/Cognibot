from app import create_app, db
from app.utils.seed import add_initial_users
from flask_cors import CORS

app = create_app()


CORS(app, resources={r"/": {"origins": ""}}, supports_credentials=True)

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        add_initial_users()
    app.run(debug=True)
