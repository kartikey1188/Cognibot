from . import *
from flask import request
from flask_restful import Resource, reqparse
from app.models.user import *
from app.models import *

from flask_jwt_extended import create_access_token, jwt_required, get_jwt
from functools import wraps
from flask import jsonify

def role_required(*roles):
    # Implementing RBAC
    def decorator(fn):
        @wraps(fn)
        @jwt_required()
        def wrapper(*args, **kwargs):
            claims = get_jwt()
            user_role = claims.get("role")  # Extract role from JWT

            if user_role not in roles:
                return {"message": "Access forbidden: Insufficient permissions"}, 403

            return fn(*args, **kwargs)
        return wrapper
    return decorator


# Customize token expiry message
@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    return {
        "message": "Your session has expired. Please log in again.",
        "error": "token_expired"
    }, 401

class UserRegister(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument("name", type=str, required=True, help="Name is required")
    parser.add_argument("email", type=str, required=True, help="Email is required")
    parser.add_argument("password", type=str, required=True, help="Password is required")
    parser.add_argument("confirm_password", type=str, required=True, help="Confirm Password is required")
    parser.add_argument("role", type=str, required=True, choices=["student", "instructor", "admin"], help="Enter role. Must be either 'student', 'instructor', or 'admin'.")

    def post(self):
        # Handle User Registration
        data = UserRegister.parser.parse_args()

        name = data["name"]
        email = data["email"]
        role = data["role"]
        password = data["password"]
        confirm_password = data["confirm_password"]

        if password != confirm_password:
            return {"message": "Passwords do not match"}, 400

        if User.query.filter_by(email=email).first():
            return {"message": "Email already exists"}, 400

        try:
            new_user = User(name=name, email=email)
            new_user.role = Role[role.upper()]  # Enum conversion
            new_user.set_password(password)  # Hash password
            db.session.add(new_user)
            db.session.commit()
            return {"message": "User registered successfully!"}, 201
        except ValueError:
            return {"message": "Invalid role provided"}, 400


class UserLogin(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument("email", type=str, required=True, help="Email is required")
    parser.add_argument("password", type=str, required=True, help="Password is required")

    def post(self):
        """Handle User Login with restricted inputs"""
        data = UserLogin.parser.parse_args()

        email = data["email"]
        password = data["password"]

        user = User.query.filter_by(email=email).first()

        if not user or not user.check_password(password):
            return {"message": "Invalid email or password"}, 401

        # Create a JWT Token
        access_token = create_access_token(identity=user.id, additional_claims={"role": user.role.value})
        return {"message": "Login successful", "access_token": access_token}, 200


api.add_resource(UserRegister, "/register")  # Signup
api.add_resource(UserLogin, "/login")  # Login
