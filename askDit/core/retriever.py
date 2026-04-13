from langchain_community.vectorstores import FAISS
from .embeddings import get_embeddings


INDEX_PATH = "askDit/data/index"


def load_vector_store():
    embeddings = get_embeddings()

    vector_store = FAISS.load_local(
        INDEX_PATH,
        embeddings,
        allow_dangerous_deserialization=True
    )

    return vector_store


def get_retriever(vector_store):
    return vector_store.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 8}
    )