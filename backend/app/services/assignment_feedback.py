import os
import traceback
import io
import contextlib
from flask import request, jsonify
from flask_restful import Resource, reqparse
from langchain_google_genai import ChatGoogleGenerativeAI
from app.apis import api

# Initialize AI Model (Gemini)
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash")

class CodeReview(Resource):
    def post(self):
        """Executes Python code safely and provides AI-powered feedback."""
        parser = reqparse.RequestParser()
        parser.add_argument("user_id", type=int, required=True, help="User ID is required")
        parser.add_argument("code", type=str, required=True, help="Python code is required")
        args = parser.parse_args()

        user_id = args["user_id"]
        submitted_code = args["code"].strip()

        if not submitted_code:
            return {"error": "Code cannot be empty"}, 400

        # Capture stdout and stderr
        stdout_capture = io.StringIO()
        stderr_capture = io.StringIO()

        result = {
            "execution_result": "",
            "error": None
        }

        try:
            with contextlib.redirect_stdout(stdout_capture), contextlib.redirect_stderr(stderr_capture):
                # Safe execution environment (allow only print, len, range)
                exec_globals = {"__builtins__": {"print": print, "len": len, "range": range}}
                exec(submitted_code, exec_globals, {})

            result["execution_result"] = stdout_capture.getvalue().strip()

        except Exception as e:
            result["error"] = {
                "type": type(e).__name__,
                "message": str(e)
            }

        # AI Feedback Prompt
        prompt = f"""
        The following Python code was submitted by a student:

        ```
        {submitted_code}
        ```

        **Execution Result:**
        {result["execution_result"] if not result["error"] else "Execution Failed"}

        **Task:**
        - Identify **syntax, indentation, and runtime errors**.
        - Suggest **improvements** for efficiency, readability, and best practices.
        - **DO NOT** provide the correct answer or solution.
        - Give suggestions using professional and constructive feedback.

        **Response Format:**
        - Errors Found:
        - Suggested Improvements:
        - Best Practices:
        """

        # Get AI-generated feedback
        ai_response = llm.invoke(prompt)
        result["feedback"] = ai_response.content.strip()

        return result, 200

# Register API route
api.add_resource(CodeReview, "/assignment_feedback")
