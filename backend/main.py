import json
from pathlib import Path
from random import choice, sample

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"

CATEGORY_FILES = {
    "animals": {
        "label": "Животные",
        "file": "animals.json",
    },
    "food": {
        "label": "Еда",
        "file": "food.json",
    },
    "basic": {
        "label": "Базовые",
        "file": "basic.json",
    },
    "verbs": {
        "label": "Глаголы",
        "file": "verbs.json",
    },
    "adjectives": {
        "label": "Прилагательные",
        "file": "adjectives.json",
    },
}


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


def load_category_words(category_key, file_name):
    file_path = DATA_DIR / file_name

    with open(file_path, "r", encoding="utf-8") as file:
        raw_words = json.load(file)

    result = []

    for index, word in enumerate(raw_words, start=1):
        result.append(
            {
                "id": f"{category_key}_{index}",
                "english": word["english"],
                "russian": word["russian"],
                "category": category_key,
            }
        )

    return result


def load_all_words():
    all_words = []

    for category_key, category_info in CATEGORY_FILES.items():
        category_words = load_category_words(
            category_key,
            category_info["file"],
        )

        all_words.extend(category_words)

    return all_words


words = load_all_words()


categories = [{"value": "all", "label": "Все слова"}]

for category_key, category_info in CATEGORY_FILES.items():
    categories.append(
        {
            "value": category_key,
            "label": category_info["label"],
        }
    )


class CheckAnswerRequest(BaseModel):
    word_id: str
    task_type: str
    answer: str


@app.get("/")
def read_root():
    return {"message": "Vocabulary API is working"}


@app.get("/words")
def get_words():
    return words


@app.get("/categories")
def get_categories():
    return categories


@app.get("/task")
def get_task(category: str = "all"):
    available_words = words

    if category != "all":
        available_words = [
            word for word in words if word.get("category") == category
        ]

    if len(available_words) == 0:
        return {"error": "Категория не найдена"}

    word = choice(available_words)
    task_type = choice(["en_ru", "ru_en", "choice"])

    if task_type == "en_ru":
        return {
            "word_id": word["id"],
            "type": "en_ru",
            "question": word["english"],
            "instruction": "Переведи слово на русский",
            "category": category,
        }

    if task_type == "ru_en":
        return {
            "word_id": word["id"],
            "type": "ru_en",
            "question": word["russian"],
            "instruction": "Переведи слово на английский",
            "category": category,
        }

    wrong_words = [item for item in available_words if item["id"] != word["id"]]

    if len(wrong_words) < 3:
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
        "category": category,
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