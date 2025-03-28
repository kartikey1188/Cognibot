import os
from . import *
from app.apis import *
from flask import current_app as app, request
import traceback
from dotenv import load_dotenv
from flask_restful import Resource
from app.utils.custom_templates import *
from app.services import *
from app.utils.clarification_helpers import *
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_google_firestore import FirestoreChatMessageHistory
from langchain.agents import tool, create_react_agent, AgentExecutor
from langchain import hub
from langchain.prompts import ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate
from app.utils.vdb import vector_db

# Load environment variables
load_dotenv()

COLLECTION_NAME = "doubts_clarification_history"

# LLM setup (Gemini)
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash")

# Defining Chat History Tool
@tool
def get_chat_history(user_id):
    """Retrieves the chat history for the given user from Firestore Database."""
    chat_history = FirestoreChatMessageHistory(
        session_id=str(user_id), collection=COLLECTION_NAME, client=client
    )
    if not chat_history.messages:
        return "No chat history found."
    
    last_5_messages = chat_history.messages[-5:]

    return last_5_messages


# Defining Syllabus Search Tool
@tool
def search_syllabus(query):
    """Using the user's input, searches the syllabus vector database for relevant content."""

    retriever = vector_db.as_retriever(
        search_type="similarity_score_threshold",
        search_kwargs={"k": 3, "score_threshold": 0.7, "filter": {"nature": "lecture"}},
    )
    relevant_chunks = retriever.invoke(query)
    
    if not relevant_chunks:
        return "The query is not relevant to the syllabus."
    
    return "\n\n".join([chunk.page_content for chunk in relevant_chunks])  # Converts list to string (easier for the AI Agent to use)

# Defining Tools
tools = [search_syllabus, get_chat_history]

prompt_template1 = hub.pull("hwchase17/react") 

custom_prompt = ChatPromptTemplate.from_messages([
    SystemMessagePromptTemplate.from_template(system_text44),
    HumanMessagePromptTemplate.from_template("User ID: {user_id}, Question: {input}")
])


# Creating Agent
agent = create_react_agent(llm, tools, custom_prompt)

verbose_mode = os.getenv("AGENT_VERBOSE", "false").strip().lower() == "true"
agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=verbose_mode, handle_parsing_errors=True)

class Clarification(Resource):
    def post(self):
        try:
            user_id = request.form.get('user_id', type=int)
            quest = request.form.get('quest').strip()
            image_file = request.files.get('image')  
            audio_file = request.files.get('audio')  

            if user_id is None:
                return {"error": "The user_id is required"}, 400

            written_query = "No written query provided" 
            image_description = "No Image Provided"
            audio_description = "No Audio Provided"

            final_quest = ""

            inputs = 0 # For all inputs
            special_inputs = 0 # For image and audio inputs
            if quest:
                inputs += 1
                written_query = quest

            if image_file:
                if image_file.mimetype not in ["image/png", "image/jpeg", "image/jpg", "image/webp"]:
                    return {"Error": "Invalid image file type. Allowed: PNG, JPEG, JPG, WEBP"}, 400
                inputs += 1
                special_inputs += 1
                image_bytes = convert_to_base64(image_file)
                image_description = describe_image(image_bytes) if image_bytes else "Couldn't convert to base64 successfully."
            
            if audio_file:
                if audio_file.mimetype not in ["audio/mpeg", "audio/wav", "audio/mp4", "audio/x-m4a", "audio/ogg"]:
                    return {"Error": "Invalid audio file type. Allowed: MP3, WAV, MP4, M4A, OGG"}, 400
                audio_file_type = audio_file.mimetype
                inputs += 1
                special_inputs += 1
                audio_bytes = convert_to_base64(audio_file)
                audio_description = describe_audio(audio_bytes, audio_file_type) if audio_bytes else "Couldn't convert to base64 successfully."
            
            if inputs == 0:
                return {"Error": "No input provided"}, 400
            
            chat_history = FirestoreChatMessageHistory(
            session_id=str(user_id), collection=COLLECTION_NAME, client=client
            )
            
            chat_history.add_user_message(quest)

            if special_inputs == 0:
                final_quest = quest
                response = agent_executor.invoke({"input": final_quest, "user_id": user_id})
                #response = alternate_agent(user_id, final_quest)

            if special_inputs!=0:
                grand_quest = special_processing(written_query, image_description, audio_description, user_id)
                app.logger.info(f"Grand Quest: {grand_quest}")
                if grand_quest == -1:
                    return {"Error": "Failed to process special inputs"}, 500
                else:
                    final_quest = grand_quest
                    response = agent_executor.invoke({"input": final_quest, "user_id": user_id})
                    #response = alternate_agent(user_id, final_quest)

            if isinstance(response, dict) and "output" in response:
                response_text = response["output"]  # Extracting response text if it's inside a dict
            else:
                response_text = str(response)  # Converting to string as a fallback
            
            app.logger.info(f"Agent Response: {response_text}")

            if response_text == "Agent stopped due to iteration limit or time limit.":
                response_text = alternate_agent(user_id, final_quest)

            chat_history.add_ai_message(response_text)  # Saving as a proper string
                
            return {"query": quest, "response": response_text}, 200

        except Exception as e:
            app.logger.error(f"Exception occurred: {e}")
            app.logger.error(traceback.format_exc())
            return {"Error": "Failed to process request"}, 500


api.add_resource(Clarification, "/clarification")

