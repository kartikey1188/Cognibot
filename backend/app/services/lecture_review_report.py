import traceback
from flask import current_app as app
from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required
from app.models.user import LectureReview, Lecture
from app.models import db
from langchain_google_genai import ChatGoogleGenerativeAI
from app.apis import api


# Initialize AI Model (Gemini)
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash")

class LectureReviewReport(Resource):
    @jwt_required()
    def get(self):
        """Generates AI-based lecture review reports for instructors."""
        parser = reqparse.RequestParser()
        parser.add_argument("course_id", type=int, required=True, help="Course ID is required")
        parser.add_argument("week", type=int, required=False, help="Week number (optional)")
        args = parser.parse_args()

        course_id = args["course_id"]
        week = args.get("week")

        # Fetch lecture reviews for the given course
        query = db.session.query(LectureReview).join(Lecture).filter(Lecture.course_id == course_id)
        if week:
            query = query.filter(Lecture.week == week)

        reviews = query.all()

        if not reviews:
            return {"message": "No reviews found for the selected course/week"}, 404

        # Formatting feedback for AI processing
        formatted_reviews = "\n".join(
            [f"Lecture {r.lecture.lecture_number} (Week {r.lecture.week}) - Rating: {r.rating}/5\nFeedback: {r.feedback}\n" for r in reviews]
        )

        # AI Analysis Prompt
        prompt = f"""
        The following is a collection of student feedback for lectures in a course.

        {formatted_reviews}

        **Task:**
        - Identify recurring issues or concerns raised by students.
        - Highlight areas where instructors can improve.
        - Suggest actionable recommendations for enhancing lecture quality.
        - Summarize student satisfaction trends based on ratings.

        **Response Format:**
        - **Common Issues:**
        - **Suggested Improvements:**
        - **Overall Student Satisfaction:**
        """

        # Generate AI-based analysis
        response = llm.invoke(prompt)
        report = response.content.strip()

        return {"course_id": course_id, "week": week, "lecture_review_report": report}, 200

api.add_resource(LectureReviewReport, "/lecture_review_report")
