from app import db
from app.models.user import User

def add_initial_users():

    users = [
        {"role": "admin", "name": "Admin User", "email": "rashmitindwani@gmail.com"},
        {"role": "regular", "name": "Regular User", "email": "deadlyheller6@gmail.com"}
    ]

    for user_data in users:
        user = User(
            role=user_data["role"],
            name=user_data["name"],
            email=user_data["email"]
        )

        existing_user = User.query.filter_by(email=user_data["email"]).first()
        if not existing_user:
            db.session.add(user)

    db.session.commit()
