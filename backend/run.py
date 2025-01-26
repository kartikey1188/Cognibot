from app import create_app, db
from app.utils.seed import add_initial_users

app = create_app()

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        add_initial_users()
    app.run(debug=True)
