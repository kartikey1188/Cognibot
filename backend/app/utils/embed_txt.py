import os
from pathlib import Path
from langchain_community.document_loaders import TextLoader
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

text_file_path = Path(__file__).resolve().parent.parent.parent / "data" / "documents" / "grading_doc.txt"

def load_and_chunk_text(text_file_path):
    # Load the text file
    text_loader = TextLoader(text_file_path)
    text_docs = text_loader.load()

    # Initialize the text splitter
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=100,
        length_function=len,
    )

    # Split the document into chunks
    chunks = text_splitter.split_documents(text_docs)

    # Add source information to each chunk
    for i, chunk in enumerate(chunks):
        chunk.metadata["source"] = f"IITM BS Grading Document"
        chunk.metadata["chunk_id"] = i + 1

    return chunks


text_chunks = load_and_chunk_text(text_file_path)

# Create persistent directory for vector database
persistent_directory = str(Path(__file__).resolve().parent.parent.parent / "data" / "grading_doc_vector_db")
if not os.path.exists(persistent_directory):
    os.makedirs(persistent_directory)

# Initialize embedding model
embedding = HuggingFaceEmbeddings(model_name="BAAI/bge-small-en")

# Create and persist the vector database
vector_db = Chroma.from_documents(
    documents=text_chunks,
    embedding=embedding,
    persist_directory=persistent_directory
)