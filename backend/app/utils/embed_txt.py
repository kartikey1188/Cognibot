import os
from pathlib import Path
from langchain_core.documents import Document
from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

text_file_path = Path(__file__).resolve().parent.parent.parent / "data" / "documents" / "grading_document.txt"

def split_and_strip_file(file_path, delimiter="CHUNK-BREAK"):

    with open(file_path, "r", encoding="utf-8") as file:
        text = file.read()
    return [chunk.strip() for chunk in text.split(delimiter) if chunk.strip()]

chunks = split_and_strip_file(text_file_path)

docs = []
for chunk in chunks:
    doc = Document(page_content=chunk, metadata={
                   "source": "JAN 2025 TERM GRADING DOCUMENT"})
    docs.append(doc)

persistent_directory = str(Path(__file__).resolve().parent.parent.parent / "data" / "grading_document_vector_db")
if not os.path.exists(persistent_directory):
    os.makedirs(persistent_directory)

embedding = HuggingFaceEmbeddings(model_name="BAAI/bge-small-en")

vector_db = Chroma.from_documents(
    documents=docs, embedding=embedding, persist_directory=persistent_directory)
