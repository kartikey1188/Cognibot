from . import *
import traceback
from app.models import db
from flask import current_app as app
from flask_restful import Resource
from app.models.user import Lecture
from app.apis import *
import re

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage

from dotenv import load_dotenv
load_dotenv()

from backend.app.utils.transcript_generator import GetSingleLectureTranscript

slt = GetSingleLectureTranscript()

llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash")

class LectureSummary(Resource):
    def get(self, lecture_id):
        try:

            transcript = slt.get(lecture_id)

            if not transcript or "Transcript" not in transcript or not transcript["Transcript"].strip():
                return {"Error": "Transcript not found or empty"}, 404

            transcript_text = transcript["Transcript"]
        
            prompt = f"""
            The following is the transcript of a lecture. I want you to give me a comprehensive summary of this lecture:

            {transcript_text}

            The summary should retain key points and main ideas; and help me quickly revise everything discussed in the lecture.
            """
            messages = [
                SystemMessage(content="You are an AI that is a helpful study assistant."),
                HumanMessage(content=prompt),
            ]

            summary = llm.invoke(messages)

            return {"lecture_summary":summary.content}, 200
        
        except Exception as e:
            app.logger.error(f"Exception occurred: {e}")
            app.logger.error(traceback.format_exc())
            return {"Error": "Failed to retrieve transcript"}, 500
        
    
api.add_resource(LectureSummary, "/lecture_summary/<int:lecture_id>")