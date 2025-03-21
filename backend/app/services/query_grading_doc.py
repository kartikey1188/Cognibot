import os
from app.apis import api
from pathlib import Path
from flask import request
from flask_restful import Resource
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import ChatPromptTemplate

# Configuration
PERSISTENT_DIRECTORY = str(Path(__file__).resolve().parent.parent.parent / "data" / "vector_database")
EMBEDDING_MODEL = "BAAI/bge-small-en"
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# Helper function to get the vector DB

def get_vector_db():
    embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)
    db = Chroma(
        persist_directory=PERSISTENT_DIRECTORY,
        embedding_function=embeddings
    )
    return db

# Helper function to get the LLM


def get_llm():
    return ChatGoogleGenerativeAI(
        model="gemini-1.5-flash",
        google_api_key=GOOGLE_API_KEY
    )

# Helper function to create the prompt template


def get_prompt_template():
    template = """
    You are an assistant helping with queries related to document of an education instituition. Answer the following question based on the provided context.
    
    Question: {query}
    
    Context:
    {context}
    
    Answer the question concisely and accurately based on the context. If the information is not in the context, 
    say that you don't have enough information to answer.
    """
    return ChatPromptTemplate.from_template(template)


class GradingDocQuery(Resource):
    def post(self):
        try:
            # Parse request data
            data = request.get_json()
            if not data or 'query' not in data:
                return {'error': 'Query is required'}, 400

            user_query = data['query']
            k = data.get('k', 3)
            score_threshold = data.get('score_threshold', 0.5)

            # Get vector DB
            db = get_vector_db()

            # Retrieve relevant documents
            retriever = db.as_retriever(
                search_type="similarity_score_threshold",
                search_kwargs={"k": k, "score_threshold": score_threshold, "filter":{"nature": "grading_doc"}},
            )
            relevant_docs = retriever.invoke(user_query)

            if not relevant_docs:
                return {
                    'answer': "I couldn't find any relevant information in the grading document to answer your question.",
                    'documents': []
                }, 200

            # Format documents for LLM context
            context_text = "\n\n".join(
                [f"Document {i+1}:\n{doc.page_content}" for i, doc in enumerate(relevant_docs)])

            # Initialize LLM
            llm = get_llm()

            # Set up prompt
            prompt = get_prompt_template()

            # Generate LLM response
            chain = prompt | llm
            result = chain.invoke(
                {"query": user_query, "context": context_text})
            answer = result.content

            # Format documents for response
            documents = []
            for doc in relevant_docs:
                doc_info = {
                    'content': doc.page_content,
                    'source': doc.metadata.get('source', None)
                }
                documents.append(doc_info)

            return {
                'answer': answer,
                'documents': documents
            }, 200

        except Exception as e:
            return {'error': f'Error processing query: {str(e)}'}, 500


# Register resources
api.add_resource(GradingDocQuery, '/api/grading/query')


