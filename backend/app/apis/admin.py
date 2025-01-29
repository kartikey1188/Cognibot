from . import api
from flask import request
from flask_restful import Resource, reqparse
from app.models.user import *
from app.models import *
from .auth import role_required
from flask_jwt_extended import jwt_required, get_jwt_identity

class AdminResource(Resource):
    # parser = reqparse.RequestParser()
    # parser.add_argument("name", type=str, required=True, help="Name is required")
    # parser.add_argument("email", type=str, required=True, help="Email is required")
    # parser.add_argument("role", type=str, required=True, choices=["student", "instructor", "admin"], help="Invalid role. Must be either 'student', 'instructor', or 'admin'.")
    # parser.add_argument("password", type=str, required=True, help="Password is required")
    # parser.add_argument("confirm_password", type=str, required=True, help="Confirm Password is required")
    @role_required("admin")
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()  # Extract user identity
        user = User.query.filter_by(id=user_id).first()
        return {"message": f"Hello, {user.role.value}"}, 200

api.add_resource(AdminResource, "/admin")  # Login
