import json
from pathlib import Path
from random import choice, sample

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
PHRASES_DIR = BASE_DIR / "phrases"
SERIES_FILE = PHRASES_DIR / "series.json"

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

def load_phrase_series():
    if not SERIES_FILE.exists():
        return []

    with open(SERIES_FILE, "r", encoding="utf-8") as file:
        return json.load(file)


def load_phrases_for_series(series_id: str):
    phrase_series = load_phrase_series()
    series_info = next(
        (item for item in phrase_series if item["id"] == series_id),
        None,
    )

    if series_info is None:
        return []

    result = []

    for file_name in series_info.get("files", []):
        file_path = PHRASES_DIR / file_name

        if not file_path.exists():
            continue

        with open(file_path, "r", encoding="utf-8") as file:
            raw_phrases = json.load(file)

        for index, phrase in enumerate(raw_phrases, start=1):
            result.append(
                {
                    "id": f"{series_id}_{phrase.get('episode_code', 'episode')}_{index}",
                    "series_id": series_id,
                    "series": phrase.get("series", series_info["title"]),
                    "season": phrase.get("season"),
                    "episode": phrase.get("episode"),
                    "episode_code": phrase.get("episode_code"),
                    "level": phrase.get("level"),
                    "words": phrase.get("words"),
                    "english": phrase.get("english"),
                    "russian": phrase.get("russian"),
                    "tags": phrase.get("tags", []),
                }
            )

    return result


def load_all_phrases():
    phrase_series = load_phrase_series()
    all_phrases = []

    for series_info in phrase_series:
        all_phrases.extend(load_phrases_for_series(series_info["id"]))

    return all_phrases

def parse_int_list(value: str | None):
    if not value or value == "all":
        return None

    return [
        int(item)
        for item in value.split(",")
        if item.strip().isdigit()
    ]


def parse_str_list(value: str | None):
    if not value or value == "all":
        return None

    return [
        item.strip()
        for item in value.split(",")
        if item.strip()
    ]

def filter_phrases(
    series: str | None = None,
    season: int | None = None,
    episode: int | None = None,
    episodes: str | None = None,
    level: str | None = None,
    levels: str | None = None,
    tag: str | None = None,
    tags: str | None = None,
):
    phrases = load_all_phrases()

    episode_list = parse_int_list(episodes)
    level_list = parse_str_list(levels)
    tag_list = parse_str_list(tags)

    if series and series != "all":
        phrases = [
            phrase for phrase in phrases if phrase["series_id"] == series
        ]

    if season is not None:
        phrases = [
            phrase for phrase in phrases if phrase.get("season") == season
        ]

    if episode is not None:
        phrases = [
            phrase for phrase in phrases if phrase.get("episode") == episode
        ]

    if episode_list:
        phrases = [
            phrase for phrase in phrases if phrase.get("episode") in episode_list
        ]

    if level and level != "all":
        phrases = [
            phrase for phrase in phrases if phrase.get("level") == level
        ]

    if level_list:
        phrases = [
            phrase for phrase in phrases if phrase.get("level") in level_list
        ]

    if tag and tag != "all":
        phrases = [
            phrase for phrase in phrases if tag in phrase.get("tags", [])
        ]

    if tag_list:
        phrases = [
            phrase
            for phrase in phrases
            if any(item in phrase.get("tags", []) for item in tag_list)
        ]

    return phrases

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

class CheckMatchingRequest(BaseModel):
    answers: dict[str, str]

class CheckPhraseRequest(BaseModel):
    phrase_id: str
    answer: str


@app.get("/")
def read_root():
    return {"message": "Vocabulary API is working"}

def get_available_words(category: str = "all"):
    if category == "all":
        return words

    return [
        word for word in words if word.get("category") == category
    ]


@app.get("/words")
def get_words():
    return words


@app.get("/categories")
def get_categories():
    return categories


@app.get("/task")
def get_task(category: str = "all"):
    available_words = get_available_words(category)

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

@app.get("/matching-task")
def get_matching_task(category: str = "all"):
    available_words = get_available_words(category)

    if len(available_words) < 4:
        return {
            "error": "Недостаточно слов для сопоставления",
        }

    selected_words = sample(available_words, 4)

    items = [
        {
            "id": word["id"],
            "english": word["english"],
        }
        for word in selected_words
    ]

    options = [
        {
            "id": word["id"],
            "russian": word["russian"],
        }
        for word in selected_words
    ]

    options = sample(options, len(options))

    return {
        "type": "matching",
        "instruction": "Сопоставь слова с переводом",
        "items": items,
        "options": options,
        "category": category,
    }

@app.post("/check-matching")
def check_matching(data: CheckMatchingRequest):
    results = []
    correct_count = 0

    for word_id, selected_translation_id in data.answers.items():
        word = next((item for item in words if item["id"] == word_id), None)
        selected_word = next(
            (item for item in words if item["id"] == selected_translation_id),
            None,
        )

        if word is None or selected_word is None:
            results.append(
                {
                    "word_id": word_id,
                    "correct": False,
                    "english": "",
                    "user_answer": "",
                    "correct_answer": "",
                }
            )
            continue

        is_correct = word["id"] == selected_word["id"]

        if is_correct:
            correct_count += 1

        results.append(
            {
                "word_id": word["id"],
                "correct": is_correct,
                "english": word["english"],
                "user_answer": selected_word["russian"],
                "correct_answer": word["russian"],
            }
        )

    return {
        "correct": correct_count,
        "total": len(data.answers),
        "results": results,
    }

@app.get("/phrase-series")
def get_phrase_series():
    return load_phrase_series()

@app.get("/phrases")
def get_phrases(
    series: str = "all",
    season: int | None = None,
    episode: int | None = None,
    episodes: str | None = None,
    level: str = "all",
    levels: str = "all",
    tag: str = "all",
    tags: str = "all",
):
    return filter_phrases(
        series=series,
        season=season,
        episode=episode,
        episodes=episodes,
        level=level,
        levels=levels,
        tag=tag,
        tags=tags,
    )

@app.get("/phrase-task")
def get_phrase_task(
    series: str = "all",
    season: int | None = None,
    episode: int | None = None,
    episodes: str = "all",
    level: str = "all",
    levels: str = "all",
    tag: str = "all",
    tags: str = "all",
):
    phrases = filter_phrases(
        series=series,
        season=season,
        episode=episode,
        episodes=episodes,
        level=level,
        levels=levels,
        tag=tag,
        tags=tags,
    )

    if len(phrases) == 0:
        return {"error": "Фразы не найдены"}

    phrase = choice(phrases)

    # Примерно 70% — выбор варианта, 30% — ручной ввод
    task_type = choice([
        "phrase_choice",
        "phrase_choice",
        "phrase_choice",
        "phrase_choice",
        "phrase_choice",
        "phrase_choice",
        "phrase_choice",
        "phrase_en_ru",
        "phrase_en_ru",
        "phrase_en_ru",
    ])

    if task_type == "phrase_choice":
        wrong_phrases = [
            item for item in phrases if item["id"] != phrase["id"]
        ]

        if len(wrong_phrases) < 3:
            wrong_phrases = [
                item for item in load_all_phrases() if item["id"] != phrase["id"]
            ]

        wrong_answers = sample(wrong_phrases, 3)

        options = [
            {
                "id": phrase["id"],
                "russian": phrase["russian"],
            }
        ] + [
            {
                "id": item["id"],
                "russian": item["russian"],
            }
            for item in wrong_answers
        ]

        options = sample(options, len(options))

        return {
            "phrase_id": phrase["id"],
            "type": "phrase_choice",
            "instruction": "Выбери правильный перевод фразы",
            "english": phrase["english"],
            "russian": phrase["russian"],
            "options": options,
            "series": phrase["series"],
            "season": phrase["season"],
            "episode": phrase["episode"],
            "episode_code": phrase["episode_code"],
            "level": phrase["level"],
            "tags": phrase["tags"],
        }

    return {
        "phrase_id": phrase["id"],
        "type": "phrase_en_ru",
        "instruction": "Переведи фразу на русский",
        "english": phrase["english"],
        "russian": phrase["russian"],
        "series": phrase["series"],
        "season": phrase["season"],
        "episode": phrase["episode"],
        "episode_code": phrase["episode_code"],
        "level": phrase["level"],
        "tags": phrase["tags"],
    }

@app.post("/check-phrase")
def check_phrase(data: CheckPhraseRequest):
    phrases = load_all_phrases()

    phrase = next(
        (item for item in phrases if item["id"] == data.phrase_id),
        None,
    )

    if phrase is None:
        return {
            "correct": False,
            "correct_answer": "",
            "message": "Фраза не найдена",
        }

    user_answer = data.answer.strip().lower()
    correct_answer = phrase["russian"].strip().lower()

    is_correct = user_answer == correct_answer

    return {
        "correct": is_correct,
        "correct_answer": phrase["russian"],
    }

@app.get("/phrase-filters")
def get_phrase_filters(series: str = "all"):
    phrases = filter_phrases(series=series)

    seasons = sorted(
        {
            phrase.get("season")
            for phrase in phrases
            if phrase.get("season") is not None
        }
    )

    episodes = sorted(
        {
            (
                phrase.get("season"),
                phrase.get("episode"),
                phrase.get("episode_code"),
            )
            for phrase in phrases
            if phrase.get("episode") is not None
        },
        key=lambda item: (item[0], item[1]),
    )

    levels = sorted(
        {
            phrase.get("level")
            for phrase in phrases
            if phrase.get("level")
        }
    )

    tags = sorted(
        {
            tag
            for phrase in phrases
            for tag in phrase.get("tags", [])
        }
    )

    return {
        "seasons": seasons,
        "episodes": [
            {
                "season": season,
                "episode": episode,
                "episode_code": episode_code,
            }
            for season, episode, episode_code in episodes
        ],
        "levels": levels,
        "tags": tags,
    }