from . import *
import traceback
from flask import current_app as app
from flask_restful import Resource
from app.apis import *
from flask_restful import reqparse

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

# Defining the embedding model
embeddings = HuggingFaceEmbeddings(model_name="BAAI/bge-small-en")

current_dir = os.path.dirname(os.path.abspath(__file__))
persistent_directory  = os.path.abspath(os.path.join(current_dir, "..", "..", "data", "vector_database"))

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

            return {"search_query": quest, "results": results}, 200
        
        except Exception as e:
            app.logger.error(f"Exception occurred: {e}")
            app.logger.error(traceback.format_exc())
            return {"Error": "Failed to conclude topic search"}, 500
        
    
api.add_resource(TopicSearch, "/topic_search")