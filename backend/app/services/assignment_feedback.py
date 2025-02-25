import os
import traceback
import sys
import io
import ast
from . import *
from app.apis import *
from flask import current_app as app
from flask_restful import Resource, reqparse
from langchain_google_genai import ChatGoogleGenerativeAI

# AI Model (Gemini)
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash")

def execute_code_safely(code):
    """Executes user-submitted Python code in a restricted environment."""
    try:
        # Ensure proper newlines are respected
        formatted_code = code.replace("; ", "\n").replace(";", "\n")

        # Check for dangerous imports
        restricted_keywords = ["os", "sys", "subprocess", "shutil", "eval", "exec", "open", "input"]
        for keyword in restricted_keywords:
            if keyword in formatted_code:
                return "Security Error: Use of restricted functions is not allowed.", "Security Violation"

        # Check for syntax errors
        try:
            ast.parse(formatted_code)  # Parses the code to check for syntax errors before execution
        except SyntaxError as e:
            return f"Syntax Error: {e}", "Syntax Error"

        # Redirect stdout to capture output
        output_buffer = io.StringIO()
        sys.stdout = output_buffer

        # Execute code in an isolated dictionary (sandbox)
        exec_globals = {"__builtins__": {}}
        exec_locals = {}

        exec(formatted_code, exec_globals, exec_locals)

        # Restore stdout
        sys.stdout = sys.__stdout__

        # Get execution output
        execution_output = output_buffer.getvalue().strip()

        return execution_output if execution_output else "Code executed successfully with no output.", None

    except Exception as e:
        sys.stdout = sys.__stdout__  # Restore stdout
        return f"Runtime Error: {e}", "Runtime Error"


class ProgrammingAssignmentFeedback(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            parser.add_argument("user_id", type=int, required=True, help="User ID is required")
            parser.add_argument("code", type=str, required=True, help="Python code is required")
            args = parser.parse_args()
            
            user_id = args["user_id"]
            code = args["code"].strip()

            if not code:
                return {"Error": "Code cannot be empty"}, 400

            # Execute the code safely and capture any errors
            execution_result, error_type = execute_code_safely(code)

            # AI Feedback prompt (Ensuring it does NOT return exact answers)
            prompt = f"""
            The following Python code was submitted by a student:

            **Code:**
            {code}

            **Execution Result:**
            {execution_result}

            **Task:**
            - If there are **errors**, explain them in simple terms.
            - If the code runs but has **inefficiencies**, suggest improvements.
            - Provide **best practices** for clean coding.
            - **DO NOT** give exact correct code or solutions.

            **Response Format:**
            - Errors Found:
            - Suggested Improvements:
            - Best Practices:
            """
            response = llm.invoke(prompt)
            response_text = response.content.strip()

            return {"user_id": user_id, "execution_result": execution_result, "feedback": response_text}, 200

        except Exception as e:
            app.logger.error(f"Exception occurred: {e}")
            app.logger.error(traceback.format_exc())
            return {"Error": "Failed to analyze assignment"}, 500


api.add_resource(ProgrammingAssignmentFeedback, "/assignment_feedback")
