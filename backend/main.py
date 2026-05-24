from random import choice, sample

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


words = [
    {"id": 1, "english": "cat", "russian": "кот"},
    {"id": 2, "english": "dog", "russian": "собака"},
    {"id": 3, "english": "apple", "russian": "яблоко"},
    {"id": 4, "english": "book", "russian": "книга"},
    {"id": 5, "english": "water", "russian": "вода"},
    {"id": 6, "english": "house", "russian": "дом"},
    {"id": 7, "english": "car", "russian": "машина"},
    {"id": 8, "english": "sun", "russian": "солнце"},
    {"id": 9, "english": "tree", "russian": "дерево"},
    {"id": 10, "english": "friend", "russian": "друг"},
]


class CheckAnswerRequest(BaseModel):
    word_id: int
    task_type: str
    answer: str


@app.get("/")
def read_root():
    return {"message": "Vocabulary API is working"}


@app.get("/words")
def get_words():
    return words


@app.get("/task")
def get_task():
    word = choice(words)
    task_type = choice(["en_ru", "ru_en", "choice"])

    if task_type == "en_ru":
        return {
            "word_id": word["id"],
            "type": "en_ru",
            "question": word["english"],
            "instruction": "Переведи слово на русский",
        }

    if task_type == "ru_en":
        return {
            "word_id": word["id"],
            "type": "ru_en",
            "question": word["russian"],
            "instruction": "Переведи слово на английский",
        }

    wrong_words = [item for item in words if item["id"] != word["id"]]
    wrong_answers = sample(wrong_words, 3)

    options = [word["russian"]] + [item["russian"] for item in wrong_answers]
    options = sample(options, len(options))

    return {
        "word_id": word["id"],
        "type": "choice",
        "question": word["english"],
        "instruction": "Выбери правильный перевод",
        "options": options,
    }


@app.post("/check")
def check_answer(data: CheckAnswerRequest):
    word = next((item for item in words if item["id"] == data.word_id), None)

    if word is None:
        return {
            "correct": False,
            "correct_answer": "",
            "message": "Слово не найдено",
        }

    user_answer = data.answer.strip().lower()

    if data.task_type == "en_ru":
        correct_answer = word["russian"].lower()
    elif data.task_type == "ru_en":
        correct_answer = word["english"].lower()
    elif data.task_type == "choice":
        correct_answer = word["russian"].lower()
    else:
        return {
            "correct": False,
            "correct_answer": "",
            "message": "Неизвестный тип задания",
        }

    is_correct = user_answer == correct_answer

    return {
        "correct": is_correct,
        "correct_answer": correct_answer,
    }