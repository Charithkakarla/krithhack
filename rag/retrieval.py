_DOCS: dict[int, list[str]] = {}


def add_document(student_id: int, text: str) -> None:
    _DOCS.setdefault(student_id, []).append(text)


def ask_document(student_id: int, question: str) -> dict:
    docs = _DOCS.get(student_id, [])
    if not docs:
        return {"answer": "No documents uploaded for this student.", "matched_documents": []}

    q = question.lower()
    matches = [i for i, d in enumerate(docs, start=1) if any(tok in d.lower() for tok in q.split())]
    best = docs[matches[0] - 1] if matches else docs[-1]
    return {"answer": best[:400], "matched_documents": matches[:3] if matches else [len(docs)]}
