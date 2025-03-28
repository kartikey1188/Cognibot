import os
from pathlib import Path
from langchain_community.document_loaders import PDFPlumberLoader
from langchain_core.documents import Document
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from app.apis import *
from flask import current_app as app
from flask_restful import Resource
import traceback

class GenerateHandbookVectorDB(Resource):
    def get(self):
        try:
            print("\n--- Starting Handbook Vector Database generation ---")

            handbook_path = Path(__file__).resolve().parent.parent.parent / "data"/ "documents" / "handbook.pdf"
            print(f"Loading handbook from: {handbook_path}")
            loader = PDFPlumberLoader(handbook_path)

            pages = loader.load()
            print(f"Number of pages loaded: {len(pages)}")

            docs = []
            for page in pages:
                doc = Document(page_content=page.page_content, metadata={"source": "IITM BS Student Handbook", "page_number": page.metadata['page'] + 1, "nature": "handbook"})
                docs.append(doc)
            print(f"Number of documents created: {len(docs)}")

            #persistent_directory = str(Path(__file__).resolve().parent.parent.parent / "data" / "handbook_vector_db")
            current_dir = os.path.dirname(os.path.abspath(__file__))
            persistent_directory = os.path.join(current_dir, "..", "..", "data", "vector_database")
            if not os.path.exists(persistent_directory):
                os.makedirs(persistent_directory)
                print(f"Created persistent directory: {persistent_directory}")

            print("\n--- Creating embeddings ---")
            embedding = HuggingFaceEmbeddings(model_name="BAAI/bge-small-en")

            print("\n--- Adding Handbook chunks to vector store ---")
            vector_db = Chroma(persist_directory=persistent_directory, embedding_function=embedding)
            vector_db.add_documents(docs)
            vector_db.persist()

            print("Handbook Vector database saved successfully.")
            print("\n--- Finished creating and persisting Handbook vector store ---")

        except Exception as e:
            app.logger.error(f"Exception occurred: {e}")
            app.logger.error(traceback.format_exc())
            print("An error occurred during Handbook Vector Database generation.")
            return {"Error": "Failed to create the student handbook vector database"}, 500


api.add_resource(GenerateHandbookVectorDB, '/generate_handbook_vectordb')