import base64
from langchain_google_genai import ChatGoogleGenerativeAI # LangChain wrapper for Google's Gemini chat models.
import google.generativeai as genai # Official Python SDK for Google's Gemini API (direct).
import base64 # For decoding image strings sent in base64 (likely via API or frontend).
import pytesseract # Python binding for Tesseract OCR — used to extract text from images.
from PIL import Image # Python Imaging Library — used to open and manipulate images
import io # Needed to convert bytes into something PIL can understand
import re # For regex-based cleanup
import os
from langchain_google_firestore import FirestoreChatMessageHistory
from dotenv import load_dotenv # To securely load GOOGLE_API_KEY from .env
from app.services import *
from app.utils.custom_templates import *
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

embeddings = HuggingFaceEmbeddings(model_name="BAAI/bge-small-en")
COLLECTION_NAME = "doubts_clarification_history"

current_dir = os.path.dirname(os.path.abspath(__file__))
persistent_directory = os.path.abspath(os.path.join(current_dir, "..", "..", "data", "vector_database"))

# Loading env vars
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)

def clean_text(text):
    """Cleans LLM-generated text while preserving actual content."""
    text = re.sub(r"\*\*(.*?)\*\*", r"\1", text)
    text = re.sub(r"\*(.*?)\*", r"\1", text)
    text = re.sub(r"_(.*?)_", r"\1", text)
    text = re.sub(r"`(.*?)`", r"\1", text)
    text = re.sub(r"<.*?>", "", text)
    return text.strip()

def convert_to_base64(file):
    """Converts uploaded file to a base64 string."""
    return base64.b64encode(file.read()).decode("utf-8") if file else None

# ----------------------------------- Audio Description: ----------------------------------------------------

def describe_audio(audio, audio_file_type):
    """Takes base64-encoded MP3 audio and uses Gemini to describe it."""

    audio_bytes = base64.b64decode(audio)

    model = genai.GenerativeModel("gemini-1.5-pro")  # audio input only supported here

    response = model.generate_content([
        "Describe in detail what the person is saying in this audio. Include any relevant context or background information.",
        {
            "mime_type": audio_file_type,
            "data": audio_bytes
        }
    ])

    return clean_text(response.text) if response and hasattr(response, "text") else "Could not generate description."


# ----------------------------------- Image Description: ----------------------------------------------------


def extract_text_from_image(image_bytes):
    image = Image.open(io.BytesIO(image_bytes))
    extracted_text = pytesseract.image_to_string(image)
    return clean_text(extracted_text)

def is_meaningful_text(text: str) -> bool:
    return bool(text.strip()) 

def describe_with_google_sdk(image_bytes: bytes) -> str:
    image = Image.open(io.BytesIO(image_bytes))
    model = genai.GenerativeModel("gemini-2.0-flash")
    response = model.generate_content([
        "You are a study assistant. Describe what the image shows, and perhaps provide some context on what the student might be trying to communicate.",
        image
    ])
    return clean_text(response.text) if response and hasattr(response, "text") else "Could not generate visual description."

def describe_image(image: str):
    image_bytes = base64.b64decode(image)
    ocr_text = extract_text_from_image(image_bytes)

    if is_meaningful_text(ocr_text):
        model = ChatGoogleGenerativeAI(
            model="gemini-2.0-flash",
            temperature=0.2,
            top_k=40,
            top_p=0.7,
            max_output_tokens=500
        )

        examples = [
            {
                "ocr": "Python Programming Basics\nError: SyntaxError",
                "desc": "This is a Python programming error. The message 'SyntaxError' indicates an issue with the syntax of the code, such as a missing colon or unmatched parentheses."
            },
            {
                "ocr": "Data Structures Lecture\nTopic: Binary Trees",
                "desc": "This is a lecture slide on Data Structures, specifically covering Binary Trees. It likely explains tree traversal methods such as in-order, pre-order, and post-order."
            },
            {
                "ocr": "Machine Learning Assignment\nError: ValueError: Input contains NaN",
                "desc": "This is a Machine Learning assignment error. The 'ValueError: Input contains NaN' suggests that the dataset contains missing values that need to be handled before training the model."
            }
        ]

        messages = []
        for ex in examples:
            messages.append({"role": "user", "content": f"OCR Text:\n{ex['ocr']}"})
            messages.append({"role": "assistant", "content": ex["desc"]})

        # Run Gemini Vision
        visual_description = describe_with_google_sdk(image_bytes)

        # Add the combined prompt
        messages.append({
            "role": "user",
            "content": f"OCR Text:\n{ocr_text}\n\nVisual Description:\n{visual_description}\n\nYou are a study assistant. Using both the OCR and visual info given earlier, describe what the image shows, and perhaps provide some context on what the student might be trying to communicate."
            })

        response = model.invoke(messages)
        return clean_text(response.content) if response else "Could not generate description."

    else:
        return describe_with_google_sdk(image_bytes)
    
    
# ----------------------------------- Special Processing: ----------------------------------------------------

def get_chat_history(user_id):

    COLLECTION_NAME = "doubts_clarification_history"

    chat_history = FirestoreChatMessageHistory(
        session_id=str(user_id), collection=COLLECTION_NAME, client=client
    )
    if not chat_history.messages:
        return "No chat history found."
    
    last_5_messages = chat_history.messages[-5:]

    return last_5_messages

def special_processing(written_query, image_description, audio_description, user_id):
    """Processes the special inputs and combines them into a single query ('Grand Quest')."""

    model = genai.GenerativeModel("gemini-2.0-flash")

    history = get_chat_history(user_id)

    combined = f"""
    You are a helper function for an AI agent that assists students with their queries. Your job is to combine the written query, image description, and audio description 
    into a single query that the AI agent can use to generate a response. You have to take the perspective of the student who provided these inputs (Written Query, Image Description and Audio Description) and ensure that
    the combined query is clear, concise, and relevant - which the AI agent will then use to generate a response. The agent doesn't know about your existence,
    it only knows that it's about to be queried by a student. So, make sure the combined query is in a format that the agent can understand and respond to effectively.

    Written Text Input (if a written query was provided by the student): {written_query}

    Image Description (the following is a description of the image that the student provided - it was generated by a function that describes images (if an image was provided by the student)): 
    {image_description}

    Audio Description (the following is a description of the audio that the student provided - it was generated by a function that describes audio (if an audio was provided by the student)):
    {audio_description}

    Just to reiterate, you are a helper function for an AI agent that assists students with their queries. Your job is to combine the written query, image description, and audio description 
    into a single query that the AI agent can use to generate a response. You have to take the perspective of the student who provided the above inputs (Written Query, Image Description and Audio Description) and ensure that
    the combined query is clear, concise, and relevant - which the AI agent will then use to generate a response. The agent doesn't know about your existence,
    it only knows that it's about to be queried by a student. So, make sure the combined query is in a format that the agent can understand and respond to effectively. For more context on what the student is doing, you can refer to the 
    last 5 messages in the chat history below (if available):

    Chat History: {history}
    """

    response = model.generate_content([combined])
    return clean_text(response.text) if response and hasattr(response, "text") else -1


# ----------------------------------- Alt Model: ----------------------------------------------------


def alt_model_gemini(final_quest, chunks, history):
    alt_model = genai.GenerativeModel("gemini-2.0-flash")

    input = alt_system_text55.format(question=final_quest, relevant_chunks=chunks, chat_history=history)

    response = alt_model.generate_content([input])
    return response.text

def get_chat_history_two(user_id):
    """Retrieves the chat history for the given user from Firestore Database."""
    chat_history = FirestoreChatMessageHistory(
        session_id=str(user_id), collection=COLLECTION_NAME, client=client
    )
    if not chat_history.messages:
        return "No chat history found."
    
    last_5_messages = chat_history.messages[-5:]

    return last_5_messages


def search_syllabus_two(query):
    """Using the user's input, searches the syllabus vector database for relevant content."""
    vector_db = Chroma(persist_directory=persistent_directory, embedding_function=embeddings)

    retriever = vector_db.as_retriever(
        search_type="similarity_score_threshold",
        search_kwargs={"k": 3, "score_threshold": 0.7, "filter": {"nature": "lecture"}},
    )
    relevant_chunks = retriever.invoke(query)
    
    if not relevant_chunks:
        return "The query is not relevant to the syllabus."
    
    return "\n\n".join([chunk.page_content for chunk in relevant_chunks])  # Converts list to string (easier for the AI Agent to use)


def alternate_agent(user_id, final_quest):
    history = get_chat_history_two(user_id)
    chunks = search_syllabus_two(final_quest)
    response_text = alt_model_gemini(final_quest, chunks, history)

    return response_text
