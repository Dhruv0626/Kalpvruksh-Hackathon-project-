from sentence_transformers import SentenceTransformer, util

model = SentenceTransformer("all-MiniLM-L6-v2")


def find_similar_question(new_question, existing_questions, threshold=0.65):

    if not existing_questions:
        return {
            "similar": False,
            "matched_question": None,
            "score": 0.0
        }

    new_embedding = model.encode(
        new_question,
        convert_to_tensor=True
    )

    best_score = 0.0
    best_question = None

    for question in existing_questions:

        old_embedding = model.encode(
            question,
            convert_to_tensor=True
        )

        score = util.cos_sim(
            new_embedding,
            old_embedding
        ).item()

        if score > best_score:
            best_score = score
            best_question = question

    return {
        "similar": best_score >= threshold,
        "matched_question": best_question if best_score >= threshold else None,
        "score": round(best_score, 3)
    }