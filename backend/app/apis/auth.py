from flask import request
from flask_restful import Resource
from app.models.user import User
from app.utils.firebase import verify_token

class UserLogin(Resource):
    def post(self):
        try:
            auth_header = request.headers.get("Authorization", None)
            decoded_token = verify_token(auth_header)
            email = decoded_token.get("email")

            if not email:
                return {"error": "Email not found in token"}, 400

            user = User.query.filter_by(email=email).first()
            if not user:
                return {"error": "User not found"}, 404

            return {
                "uid": user.id,
                "email": user.email,
                "role": user.role
            }, 200

        except ValueError as e:
            return {"error": str(e)}, 401
