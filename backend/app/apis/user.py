from . import *
from app.models import db
from app.models.user import User
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restful import Resource

# class UserResource(Resource):

#     @jwt_required()
#     def get(self):
#         user_id = get_jwt_identity()
#         user = User.query.filter_by(id = user_id).first()
#         return {"name":user.name, "email":user.email, "id":user_id, "role":user.role.value}, 200
    
# api.add_resource(UserResource, "/getuser")