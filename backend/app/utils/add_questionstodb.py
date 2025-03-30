import os
import json
import traceback
from app.apis import *
from flask import current_app as app
from flask_restful import Resource
from langchain.text_splitter import CharacterTextSplitter
from langchain.schema import Document
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

# Defining directories
current_dir = os.path.dirname(os.path.abspath(__file__))
questions_dir = os.path.join(current_dir, "..", "..", "data", "questions")
persistent_directory = os.path.join(current_dir, "..", "..", "data", "vector_database")

# Keys to exclude from full chunks
EXCLUDE_KEYS = {"qid", "points", "answer", "type"}

class AddQuestionsToVectorDB(Resource):
    def get(self):
        try:
            if not os.path.exists(questions_dir):
                raise FileNotFoundError(f"The directory {questions_dir} does not exist.")

            # Load all question files
            question_files = [f for f in os.listdir(questions_dir) if f.endswith(".json")]
            documents = []
            count = 0

            for file in question_files:
                file_path = os.path.join(questions_dir, file)
                with open(file_path, "r", encoding="utf-8") as f:
                    data = json.load(f)

                for q in data.get("questions", []):
                    # Create small chunk (only question text)
                    small_chunk = Document(
                        page_content=q["question"],
                        metadata={"nature": "question"}
                    )
                    documents.append(small_chunk)
                    count += 1

                    # Create full chunk with exclusions
                    full_chunk = {k: v for k, v in q.items() if k not in EXCLUDE_KEYS}
                    full_chunk_doc = Document(
                        page_content=json.dumps(full_chunk, ensure_ascii=False),
                        metadata={"nature": "question"}
                    )
                    documents.append(full_chunk_doc)
                    count += 1

            print(f"Processed {count} question chunks.")

            if not documents:
                print("No question chunks to store! Exiting.")
                return {"Error": "No data to store in vector DB"}, 500

            # 🔹 **Convert Document objects into plain text before splitting**
            text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=20)
            chunks = []
            for doc in documents:
                split_texts = text_splitter.split_text(doc.page_content)  # Splitting into chunks
                for chunk_text in split_texts:
                    chunks.append(Document(page_content=chunk_text, metadata=doc.metadata))

            print(f"Number of chunks after splitting: {len(chunks)}")

            # Create embeddings
            embeddings = HuggingFaceEmbeddings(model_name="BAAI/bge-small-en")

            # Initialize Vector Database
            vector_db = Chroma(persist_directory=persistent_directory, embedding_function=embeddings)

            # Add chunks to vector database
            vector_db.add_documents(chunks)
            vector_db.persist()  # Ensure data is saved

            print("Questions added to Vector Database successfully.")
            return {"Message": "Questions successfully added to vector DB"}, 200

        except Exception as e:
            app.logger.error(f"Exception occurred: {e}")
            app.logger.error(traceback.format_exc())
            return {"Error": "Failed to add questions to the vector database"}, 500

api.add_resource(AddQuestionsToVectorDB, '/add_questions_vectordb')
