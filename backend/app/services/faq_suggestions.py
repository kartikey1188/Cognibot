from . import *
from app.apis import *
from flask import current_app as app
import traceback
from dotenv import load_dotenv
from flask_restful import Resource, reqparse
from app.services import *
from google.cloud import firestore
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage

# Load environment variables
load_dotenv()

COLLECTION_NAME = "faq"

# LLM setup (Gemini)
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash")

def get_faq_history(lecture_id):
    """Retrieves student doubts from Firestore for a particular lecture."""
    doubts_ref = client.collection(COLLECTION_NAME).where("lecture_id", "==", lecture_id).stream()

    doubts = [doc.to_dict().get("doubt", "Unknown doubt") for doc in doubts_ref]  # Extracting only doubt texts

    return doubts

class FAQSuggestions(Resource):
    def get(self, lecture_id):
        try:            
            data = get_faq_history(lecture_id)

            if not data:
                return {"lecture_id": lecture_id, "faq_suggestions": "No questions/doubts asked by the students for this lecture."}, 200

            prompt = f"""
            The following is a list of all the questions/doubts that have been asked by the students so far for this particular lecture: 

            {data}

            I want you to give me comprehensive suggestions regarding how to address these questions/doubts to my students, so that I can address them proactively in future sessions in my classroom.
            Please keep in mind that my objective is to prioritize the FREQUENTLY ASKED questions, so MAKE SURE that you're also observant on how many times/how often each question is getting asked.

            Note: If the list is only comprised of sentences that don't make any logical sense at all, simply return "No relevant questions/doubts asked by the students for this lecture."
            """

            messages = [
                SystemMessage(content="You are an AI that is a helpful to academic course instructors/teachers."),
                HumanMessage(content=prompt),
            ]

            faq_suggestions = llm.invoke(messages)

            return {"lecture_id": lecture_id, "faq_suggestions":faq_suggestions.content}, 200

        except Exception as e:
            app.logger.error(f"Exception occurred: {e}")
            app.logger.error(traceback.format_exc())
            return {"Error": "Failed to retrieve suggestions on frequently asked questions."}, 500
        

class ReceiveDoubt(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            parser.add_argument("lecture_id", type=int, required=True, help="The Lecture ID is required")
            parser.add_argument("doubt", type=str, required=True, help="A question/doubt is required")
            args = parser.parse_args()
            
            doubt = args["doubt"].strip()
            lecture_id = args["lecture_id"]

            client.collection(COLLECTION_NAME).add({
                "lecture_id": lecture_id,
                "doubt": doubt,
            })

            return {"Message": "Question/Doubt received successfully"}, 201

        except Exception as e:
            app.logger.error(f"Exception occurred: {e}")
            app.logger.error(traceback.format_exc())
            return {"Error": "Failed to receive question/doubt."}, 500
        

api.add_resource(FAQSuggestions, "/faq_suggestions/<int:lecture_id>")
api.add_resource(ReceiveDoubt, "/receive_doubt")

