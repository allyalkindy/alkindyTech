import os
import requests
from .ingest import build_index
from .retriever import INDEX_PATH, get_retriever, load_vector_store


class AskDitEngine:
    def __init__(self):
        index_file = os.path.join(INDEX_PATH, "index.faiss")
        if not os.path.exists(index_file):
            build_index()

        self.vector_store = load_vector_store()
        self.retriever = get_retriever(self.vector_store)

        self.ollama_url = "http://127.0.0.1:11434/api/generate"
        self.model = "hf.co/cognitivecomputations/Dolphin3.0-Llama3.1-8B-GGUF:Q4_0"

    def build_prompt(self, context, question):
        print("context", context)
        return f"""
You are AskDit assistant.

Use ONLY the context below to answer.

<context>
{context}
</context>

Question: {question}
"""

    def ask(self, question: str):
        docs = self.retriever.invoke(question)

        context = "\n\n".join([doc.page_content for doc in docs])

        prompt = self.build_prompt(context, question)

        response = requests.post(
            self.ollama_url,
            json={
                "model": self.model,
                "prompt": prompt,
                "stream": False
            }
        )

        return {
            "answer": response.json()["response"],
            "context": [doc.page_content for doc in docs]
        }