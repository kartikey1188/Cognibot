import os
from pathlib import Path
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

# Define the persistent directory
persistent_directory = str(Path(__file__).resolve().parent.parent.parent / "data" / "grading_doc_vector_db")

# Define the embedding model
embeddings = HuggingFaceEmbeddings(model_name="BAAI/bge-small-en")

# Load the existing vector store with the embedding function
db = Chroma(persist_directory=persistent_directory,
            embedding_function=embeddings)

# Define the user's question
query = "What is grading pattern for programming in python?"

# Retrieve relevant documents based on the query
retriever = db.as_retriever(
    search_type="similarity_score_threshold",
    search_kwargs={"k": 3, "score_threshold": 0.5},
)
relevant_docs = retriever.invoke(query)

# Display the relevant results with metadata
print("\n--- Relevant Documents ---")
for i, doc in enumerate(relevant_docs, 1):
    print(f"Document {i}:\n{doc.page_content}\n")
    if doc.metadata:
        print(f"Source: {doc.metadata.get('source', 'Unknown')}\n")
        print(f"Page Number: {doc.metadata.get('page_number', 'Unknown')}\n")
