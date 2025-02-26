import os
from pathlib import Path
from langchain_community.document_loaders import PDFPlumberLoader
from langchain_core.documents import Document
from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

handbook_path = Path(__file__).resolve().parent.parent.parent / "data"/ "documents" / "handbook.pdf"
loader = PDFPlumberLoader(handbook_path)

pages = loader.load()

docs=[]
for page in pages:
    doc = Document(page_content=page.page_content, metadata={"source": "IITM BS Student Handbook", "page_number": page.metadata['page'] + 1})
    docs.append(doc)

persistent_directory = str(Path(__file__).resolve().parent.parent.parent / "data" / "handbook_vector_db")
if not os.path.exists(persistent_directory):
    os.makedirs(persistent_directory)


embedding = HuggingFaceEmbeddings(model_name="BAAI/bge-small-en")

vector_db = Chroma.from_documents(
    documents=docs, embedding=embedding, persist_directory=persistent_directory)

