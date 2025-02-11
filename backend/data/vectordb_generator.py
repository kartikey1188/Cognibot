import os

from langchain.text_splitter import CharacterTextSplitter
from langchain_community.document_loaders import TextLoader
from langchain_community.vectorstores import Chroma
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.embeddings import HuggingFaceEmbeddings

# Defining the directory containing the transcript text files and the persistent directory
current_dir = os.path.dirname(os.path.abspath(__file__))
transcript_dir = os.path.join(current_dir, "transcripts")
persistent_directory = os.path.join(current_dir, "vector_databases") # the directory for the vector database to be situated

print(f"Transcript directory: {transcript_dir}")
print(f"Persistent directory: {persistent_directory}")

# Check if the Chroma vector store already exists
if not os.path.exists(persistent_directory):
    print("Persistent directory does not exist. Initializing vector store...")

    # Ensure the transcript directory exists
    if not os.path.exists(transcript_dir):
        raise FileNotFoundError(
            f"The directory {transcript_dir} does not exist. Please check the path."
        )

    # List all text files in the directory
    transcript_files = [f for f in os.listdir(transcript_dir) if f.endswith(".txt")]

    # Read the text content from each file and store it with metadata
    documents = []
    for transcript in transcript_files:
        file_path = os.path.join(transcript_dir, transcript)
        loader = TextLoader(file_path)
        transcript_docs = loader.load()
        for doc in transcript_docs:
            # Add metadata to each document indicating its source
            doc.metadata = {"source": transcript}
            documents.append(doc)

    # Split the documents into chunks
    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=20)
    docs = text_splitter.split_documents(documents)

    # Display information about the split documents
    print("\n--- Document Chunks Information ---")
    print(f"Number of document chunks: {len(docs)}")

    # Create embeddings
    print("\n--- Creating embeddings ---")
    embeddings = HuggingFaceEmbeddings(
        model="BAAI/bge-small-en"
    )  
    print("\n--- Finished creating embeddings ---")

    # Create the vector store and persist it
    print("\n--- Creating and persisting vector store ---")
    db = Chroma.from_documents(
        docs, embeddings, persist_directory=persistent_directory)
    print("\n--- Finished creating and persisting vector store ---")

else:
    print("Vector store already exists. No need to initialize.")
