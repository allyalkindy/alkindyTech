import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS

from .embeddings import get_embeddings


PDF_PATH = "askDit/data/sources/pdf"
INDEX_PATH = "askDit/data/index"


def load_pdfs():
    docs = []

    for file in os.listdir(PDF_PATH):
        if file.endswith(".pdf"):
            loader = PyPDFLoader(os.path.join(PDF_PATH, file))
            docs.extend(loader.load())

    return docs


def split_documents(docs):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1500,
        chunk_overlap=200
    )

    return splitter.split_documents(docs)


def build_index():
    print("Loading PDFs...")
    docs = load_pdfs()

    print("Splitting documents...")
    chunks = split_documents(docs)

    print("Creating embeddings...")
    embeddings = get_embeddings()

    print("Building FAISS index...")
    db = FAISS.from_documents(chunks, embeddings)

    print("Saving index...")
    db.save_local(INDEX_PATH)

    print("Done!")


if __name__ == "__main__":
    build_index()