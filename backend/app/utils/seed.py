from app import db
from app.models.user import User, Role

def add_initial_users():

    users = [
        {"role": "admin", "name": "Admin User", "email": "rashmi@gmail.com"},
    ]

    for user_data in users:
        user = User(
            role=Role.ADMIN,
            name=user_data["name"],
            email=user_data["email"]
        )

        existing_user = User.query.filter_by(email=user_data["email"]).first()
        if not existing_user:
            user.set_password("password")
            db.session.add(user)

    db.session.commit()
