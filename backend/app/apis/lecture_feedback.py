from flask import request
from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import db
from app.models.user import LectureReview, Lecture
from app.apis import api

class LectureFeedback(Resource):
    def post(self):
        """Allows students to submit feedback for a lecture."""
        parser = reqparse.RequestParser()
        parser.add_argument("lecture_id", type=int, required=True, help="Lecture ID is required")
        parser.add_argument("rating", type=int, required=True, choices=range(1, 6), help="Rating must be between 1 and 5")
        parser.add_argument("feedback", type=str, required=True, help="Feedback text is required")
        parser.add_argument("user_id", type=int, required=True, help="User ID is required")
        args = parser.parse_args()

        lecture_id = args["lecture_id"]
        rating = args["rating"]
        feedback_text = args["feedback"]
        user_id_ = args["user_id"]

        if not Lecture.query.get(lecture_id):
            return {"message": "Lecture not found"}, 404

        new_review = LectureReview(lecture_id=lecture_id, user_id=user_id_, rating=rating, feedback=feedback_text)
        db.session.add(new_review)
        db.session.commit()

        return {"message": "Feedback submitted successfully"}, 201

api.add_resource(LectureFeedback, "/submit_feedback")
