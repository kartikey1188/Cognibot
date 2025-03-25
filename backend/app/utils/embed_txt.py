import os
from pathlib import Path
from langchain_core.documents import Document
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from app.apis import *
from flask import current_app as app
from flask_restful import Resource
import traceback

class GenerateGradingDocVectorDB(Resource):
    def get(self):
        try:
            print("\n--- Starting Grading Doc Vector Database generation for grading document ---")
            text_file_path = Path(__file__).resolve().parent.parent.parent / "data" / "documents" / "grading_document.txt"

            def split_and_strip_file(file_path, delimiter="CHUNK-BREAK"):
                print(f"Reading and splitting file: {file_path}")
                with open(file_path, "r", encoding="utf-8") as file:
                    text = file.read()
                return [chunk.strip() for chunk in text.split(delimiter) if chunk.strip()]

            chunks = split_and_strip_file(text_file_path)
            print(f"Number of chunks created: {len(chunks)}")

            docs = []
            for chunk in chunks:
                doc = Document(page_content=chunk, metadata={
                            "source": "JAN 2025 TERM GRADING DOCUMENT", "nature": "grading_doc"})
                docs.append(doc)
            print(f"Number of documents created: {len(docs)}")

            #persistent_directory = str(Path(__file__).resolve().parent.parent.parent / "data" / "grading_document_vector_db")
            current_dir = os.path.dirname(os.path.abspath(__file__))
            persistent_directory = os.path.join(current_dir, "..", "..", "data", "vector_database")
            if not os.path.exists(persistent_directory):
                os.makedirs(persistent_directory)
                print(f"Created persistent directory: {persistent_directory}")

            print("\n--- Creating embeddings ---")
            embedding = HuggingFaceEmbeddings(model_name="BAAI/bge-small-en")

            print("\n--- Adding Grading Doc chunks to vector store ---")
            vector_db = Chroma(persist_directory=persistent_directory, embedding_function=embedding)
            vector_db.add_documents(docs)
            vector_db.persist()

            print("Grading Doc Vector database saved successfully.")
            print("\n--- Finished creating and persisting Grading Doc vector store ---")

        except Exception as e:
            app.logger.error(f"Exception occurred: {e}")
            app.logger.error(traceback.format_exc())
            return {"Error": "Failed to create the grading doc vector database"}, 500


api.add_resource(GenerateGradingDocVectorDB, '/generate_grading_doc_vectordb')