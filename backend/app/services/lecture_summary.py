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

#from backend.app.utils.transcript_generator import GetSingleLectureTranscript

#slt = GetSingleLectureTranscript()

llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash")

def sanitize_filename(filename):
    return re.sub(r'[\\/:\*?"<>|]', '_', str(filename))

def get_transcript(lecture_id):
    try:
        lecture = Lecture.query.filter(Lecture.lecture_id==lecture_id).first()
        if not lecture:
            return {"Error": "Lecture not found"}, 404
        filename = sanitize_filename(f"{lecture.course.course_name}__{lecture.week}__{lecture.lecture_id}__{lecture.title}.txt")
        transcript_path = os.path.join(app.config["TRANSCRIPT_FOLDER"], filename)
        with open(transcript_path, "r") as f:
            transcript = f.read()
        full = {"Transcript": transcript, "lecture_id": lecture.lecture_id, "title": lecture.title}
        return full
        
    except Exception as e:
        app.logger.error(f"Exception occurred: {e}")
        app.logger.error(traceback.format_exc())
        return {"Error": "Failed to retrieve transcript"}, 500

class LectureSummary(Resource):
    def get(self, lecture_id):
        try:

            transcript = get_transcript(lecture_id)

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

            return {"lecture_id" : transcript["lecture_id"], "title" : transcript["title"], "lecture_summary" : summary.content}, 200
        
        except Exception as e:
            app.logger.error(f"Exception occurred: {e}")
            app.logger.error(traceback.format_exc())
            return {"Error": "Failed to retrieve transcript"}, 500
        
    
api.add_resource(LectureSummary, "/lecture_summary/<int:lecture_id>")