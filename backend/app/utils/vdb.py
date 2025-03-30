from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
import os

embeddings = HuggingFaceEmbeddings(model_name="BAAI/bge-small-en")

current_dir = os.path.dirname(os.path.abspath(__file__))

persistent_directory = os.path.abspath(os.path.join(current_dir, "..", "..", "data", "vector_database"))

vector_db = Chroma(persist_directory=persistent_directory, embedding_function=embeddings)
