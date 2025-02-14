import traceback
import os
from app.apis import *
from flask import current_app as app
from flask_restful import Resource
from app.models.user import Lecture, Course
from youtube_transcript_api import YouTubeTranscriptApi
import re

def sanitize_filename(filename):
    return re.sub(r'[\\/:\*?"<>|]', '_', str(filename))

class GenerateAllTranscripts(Resource):
    def get(self):
        try:
            lectures = Lecture.query.all()
            if not lectures:
                return {"Error": "No lectures found"}, 404
            
            transcript_texts = []
            count=0
            for lecture in lectures:
                video_id = self.extract_video_id(lecture.lecture_link)
                if not video_id:
                    continue

                transcript = self.get_youtube_transcript(video_id)
                if transcript:
                    filename = sanitize_filename(f"{lecture.course.course_name}__{lecture.week}__{lecture.title}.txt")
                    transcript_location = os.path.join(app.config["TRANSCRIPT_FOLDER"], filename)
                    with open(transcript_location, "w", encoding="utf-8") as f:
                        f.write(transcript)

                    transcript_texts.append(transcript)
                    count+=1

            if not transcript_texts:
                return {"Error": "No transcripts available"}, 500

            return {"Success":f"{count} transcript files generated!"}
     

        except Exception as e:
            app.logger.error(f"Exception occurred: {e}")
            app.logger.error(traceback.format_exc())
            return {"Error": "Failed to create transcripts"}, 500

    def extract_video_id(self, url):
        #Extracting video ID from YouTube URL.
        if "watch?v=" in url:
            return url.split("watch?v=")[-1].split("&")[0]
        elif "youtu.be/" in url:
            return url.split("youtu.be/")[-1].split("?")[0]
        return None

    def get_youtube_transcript(self, video_id):
        #Fetching transcript from YouTube."""
        try:
            transcript = YouTubeTranscriptApi.get_transcript(video_id)
            return " ".join([t["text"] for t in transcript])
        except Exception:
            return None
        

class GetSingleLectureTranscript(Resource): 
    def get(self, lecture_id):
        try:
            lecture = Lecture.query.filter(Lecture.lecture_id==lecture_id).first()
            if not lecture:
                return {"Error":"Could not retrieve the lecture you're trying to access. Check the parameter you have passed carefully."}
            video_id = self.extract_video_id(lecture.lecture_link)
            if not video_id:
                return {"Error": "Invalid YouTube link"}, 400

            transcript = self.get_youtube_transcript(video_id)
            if not transcript:
                return {"Error": "Transcript not available"}, 404

            return {"Transcript": transcript}

        except Exception as e:
            app.logger.error(f"Exception occurred: {e}")
            app.logger.error(traceback.format_exc())
            return {"Error": "Failed to retrieve transcript"}, 500

    def extract_video_id(self, url):
        if "watch?v=" in url:
            return url.split("watch?v=")[-1].split("&")[0]
        elif "youtu.be/" in url:
            return url.split("youtu.be/")[-1].split("?")[0]
        return None

    def get_youtube_transcript(self, video_id):
        try:
            transcript = YouTubeTranscriptApi.get_transcript(video_id)
            return " ".join([t["text"] for t in transcript])
        except Exception:
            return None

api.add_resource(GenerateAllTranscripts, "/generate_all_transcripts")
api.add_resource(GetSingleLectureTranscript, "/get_single_lecture_transcript/<int:lecture_id>")

