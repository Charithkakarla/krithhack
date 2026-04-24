_TESTS: dict[int, dict] = {}
_TEST_COUNTER = 1


def start_test(student_id: int) -> dict:
    global _TEST_COUNTER
    questions = [
        {"question": "2 + 2 = ?", "options": ["3", "4", "5", "6"]},
        {"question": "Sun rises in?", "options": ["North", "East", "West", "South"]},
        {"question": "Water formula?", "options": ["H2O", "CO2", "O2", "NaCl"]},
        {"question": "5 x 3 = ?", "options": ["8", "10", "15", "20"]},
        {"question": "Largest planet?", "options": ["Mars", "Earth", "Jupiter", "Venus"]},
    ]
    answers = ["4", "East", "H2O", "15", "Jupiter"]

    test_id = _TEST_COUNTER
    _TEST_COUNTER += 1
    _TESTS[test_id] = {"student_id": student_id, "questions": questions, "answers": answers}

    return {
        "test_id": test_id,
        "link": f"/tests/{test_id}/attempt",
        "questions": questions,
    }


def submit_test(test_id: int, selected_answers: list[str]) -> dict:
    test = _TESTS.get(test_id)
    if not test:
        return {"error": "test not found"}

    score = sum(1 for i, ans in enumerate(selected_answers) if i < 5 and ans == test["answers"][i])
    return {
        "test_id": test_id,
        "score": score,
        "max_score": 5,
        "percentage": round((score / 5) * 100, 2),
    }
