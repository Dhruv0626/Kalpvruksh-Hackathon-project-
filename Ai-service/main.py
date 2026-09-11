from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

from similarity import find_similar_question
from classifier import classify_question
from priority import calculate_priority


app = FastAPI(
    title="ClassQ AI Service",
    description="AI service for repeated and unorganized classroom questions",
    version="1.0"
)


class QuestionRequest(BaseModel):

    question: str

    existing_questions: List[str] = []

    repeat_count: int = 1


@app.get("/")
def home():

    return {
        "success": True,
        "message": "ClassQ AI Service is running"
    }


@app.post("/analyze")
def analyze_question(data: QuestionRequest):

    similarity_result = find_similar_question(
        data.question,
        data.existing_questions
    )

    category = classify_question(
        data.question
    )

    priority = calculate_priority(
        data.repeat_count,
        category
    )

    return {

        "success": True,

        "question": data.question,

        "similar": similarity_result["similar"],

        "matched_question":
            similarity_result["matched_question"],

        "similarity_score":
            similarity_result["score"],

        "category": category,

        "priority": priority
    }