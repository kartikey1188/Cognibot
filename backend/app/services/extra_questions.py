import os
import traceback
from . import *
from app.apis import *
from flask import current_app as app
from flask_restful import Resource, reqparse
from langchain_google_genai import ChatGoogleGenerativeAI
from backend.data.transcript_generator import GetSingleLectureTranscript

# Initialize the transcript retriever
slt = GetSingleLectureTranscript()

# AI Model (Gemini)
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash")

class ExtraPracticeQuestions(Resource):
    def get(self):
        try:
            parser = reqparse.RequestParser()
            parser.add_argument("lecture_id", type=int, required=True, help="A lecture ID is required")
            args = parser.parse_args()
            
            lecture_id = args["lecture_id"]

            # Retrieve the transcript for the given lecture
            transcript_data = slt.get(lecture_id)

            if not transcript_data or "Transcript" not in transcript_data or not transcript_data["Transcript"].strip():
                return {"Error": "Transcript not found or empty"}, 404

            transcript_text = transcript_data["Transcript"]

            # Generate multiple-choice practice questions based on the transcript
            prompt = f"""
            Below is the transcript of a lecture:

            {transcript_text}

            **Task:** Based on this lecture, generate **5 unique and deep multiple-choice questions (MCQs)** that test the student's understanding.

            **Question Format:** Each question must have:
            - A question statement.
            - 4 answer choices (A, B, C, D).
            - The correct answer labeled separately.

            **Response Format (JSON):**
            {{
                "lecture_id": {lecture_id},
                "questions": [
                    {{
                        "question": "What is the main principle of recursion?",
                        "options": {{
                            "A": "Repeating a process with different inputs",
                            "B": "Using loops instead of function calls",
                            "C": "Executing a function only once",
                            "D": "Avoiding function calls"
                        }},
                        "correct_answer": "A"
                    }},
                    ...
                ]
            }}
            """

            response = llm.invoke(prompt)
            response_text = response.content.strip()

            return {"lecture_id": lecture_id, "questions": response_text}, 200

        except Exception as e:
            app.logger.error(f"Exception occurred: {e}")
            app.logger.error(traceback.format_exc())
            return {"Error": "Failed to generate extra practice questions"}, 500


api.add_resource(ExtraPracticeQuestions, "/extra_questions")
