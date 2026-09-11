def classify_question(question):

    text = question.lower()

    administrative_keywords = [
        "deadline",
        "submission",
        "submit",
        "assignment",
        "attendance",
        "exam",
        "test",
        "schedule",
        "class time",
        "class timing",
        "lecture time",
        "marks",
        "result",
        "holiday",
        "link",
        "meeting"
    ]

    for keyword in administrative_keywords:
        if keyword in text:
            return "Administrative"

    return "Conceptual"