from .core.engine import AskDitEngine


def run():
    engine = AskDitEngine()

    while True:
        question = input("\nAskDit > ")

        if question.lower() in ["exit", "quit"]:
            break

        result = engine.ask(question)

        print("\nAnswer:\n")
        print(result["answer"])


if __name__ == "__main__":
    run()