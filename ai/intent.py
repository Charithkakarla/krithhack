def detect_intent(text: str) -> str:
    lower = text.lower().strip()
    if "attendance" in lower:
        return "attendance"
    if "report" in lower or "result" in lower:
        return "report"
    if "document" in lower or "notice" in lower:
        return "document"
    if "test" in lower:
        return "test"
    return "general"
