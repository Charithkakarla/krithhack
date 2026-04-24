from ai.intent import detect_intent


ALLOWED_ROLES = {"student", "parent"}


def can_access_view(requesting_role: str, target_view: str) -> bool:
    if requesting_role not in ALLOWED_ROLES:
        return False
    if requesting_role == "student" and target_view.startswith("parent"):
        return False
    return True


def can_join_classroom(student_school_id: int, classroom_school_id: int) -> bool:
    return student_school_id == classroom_school_id


def verify_parent_child_link(parent_username: str, child_username: str, child_password: str) -> bool:
    # Hook this into your authentication store so the child's exact credentials are verified.
    return bool(parent_username and child_username and child_password)


def process_message(sender: str, text: str) -> tuple[str, str]:
    intent = detect_intent(text)

    if intent == "attendance":
        return intent, "Fetching attendance summary now."
    if intent == "report":
        return intent, "Generating weekly report with graphs and insights."
    if intent == "document":
        return intent, "Searching uploaded documents for your question."
    return "general", "I can help with attendance, reports, tests, and document Q&A."
