from app.models import db
from app.models.user import User
from flask_restful import Resource


class UserResource(Resource):
    def get(self):
        users = User.query.all()
        if users:
            return [{"id": user.id, "name": user.name, "email": user.email} for user in users]
        return {'message': 'No users found!'}

    def post(self):
        new_user = User(name="John Doe", email="johndoe@example.com")
        db.session.add(new_user)
        db.session.commit()
        return {"message": "User created", "id": new_user.id}, 201
