from . import *
import traceback
from flask import current_app as app
from flask_restful import Resource
from app.apis import *
from flask_restful import reqparse
from dotenv import load_dotenv
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
import google.generativeai as genai
import json 
import re

# Defining the embedding model
embeddings = HuggingFaceEmbeddings(model_name="BAAI/bge-small-en")

current_dir = os.path.dirname(os.path.abspath(__file__))
persistent_directory  = os.path.abspath(os.path.join(current_dir, "..", "..", "data", "vector_database"))

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)
load_dotenv()

class TopicSearch(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            parser.add_argument("quest", type=str, required=True, help="A query is required")
            args = parser.parse_args()
            quest = args["quest"].strip()

            # Loading the existing vector store with the embedding function
            vector_db = Chroma(persist_directory=persistent_directory,
                        embedding_function=embeddings)     

            # Searching the vector database for relevant chunks
            retriever = vector_db.as_retriever(
                search_type="similarity_score_threshold",
                search_kwargs={"k": 3, "score_threshold": 0.6, "filter": {"nature": "lecture"}},
            )

            relevant_chunks = retriever.invoke(quest)

            # Extract metadata from relevant chunks
            results = [chunk.metadata for chunk in relevant_chunks]

            model1 = genai.GenerativeModel("gemini-2.0-flash")

            for_model = """
                You are a tool INSIDE a function. The function itself takes in a user query and returns a list of related topics present in the syllabus.

                Your role as a tool is to evaluate the relevance of the vector database search results to the user query. You are NOT the function, only a tool used within it.

                You must return a JSON object with two fields:
                1. "Bool": A boolean value — either true or false (with smallercase t or f) — indicating whether the search results are related to the user query.
                2. "Reason": A brief explanation justifying why "Bool" is either true or false.

                You must use your critical thinking skills to make this judgment. The results do not need to match the query word-for-word — if they are conceptually or contextually related, you should return "Bool": True. 

                Examples:
                - If the query is "agile" and the results mention sprint planning, scrum, or iterative development, return "Bool": True.
                - If the query is "if-else statements" and the results talk about conditional logic or flow control in Python, return "Bool": True.
                - If the query is "data mining" and the results are about web development frameworks with no mention of mining techniques, return "Bool": False.
                - If the query is "indian history" and the results are about machine learning algorithms, return "Bool": False.

                Only return the JSON response. Do not include anything else.

                Search Query: 
                {quest}

                Results (A list of JSON objects, might have upto three objects, if any):
                {results}
                """.format(quest=quest, results=results)

            check_if_related = model1.generate_content([
                for_model
            ])
            app.logger.info(f"check_if_related: {check_if_related.text}")

            cleaned_response = re.sub(r"```(json)?", "", check_if_related.text).strip()
            response_data = json.loads(cleaned_response)

            relation = str(response_data["Bool"]).strip()

            if relation == "True":
                return {"search_query": quest, "results": results}, 200
            if relation == "False":
                return {"search_query": quest, "results": "No related topics found in any of the subjects or lectures."}, 400
            else:
                return {"Error": "Failed to conclude topic search"}, 500
        
        except Exception as e:
            app.logger.error(f"Exception occurred: {e}")
            app.logger.error(traceback.format_exc())
            return {"Error": "Failed to conclude topic search"}, 500
        
    
api.add_resource(TopicSearch, "/topic_search")