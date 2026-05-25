# Vocabulary App

Fullstack-приложение для тренировки английских слов.

Проект состоит из двух частей:

- Frontend: React + Vite
- Backend: Python + FastAPI

Приложение позволяет тренировать слова по категориям, проходить задания, смотреть результат сессии и экспортировать историю в TXT-файл.

---

## Функциональность

- Тренировка перевода с английского на русский
- Тренировка перевода с русского на английский
- Выбор правильного варианта ответа
- Режим сопоставления слов и переводов
- Выбор категории слов
- История тренировочных сессий
- Сохранение истории в localStorage
- Экспорт истории тренировок в TXT
- Хранение слов в отдельных JSON-файлах

---

## Стек

### Frontend

- React
- Vite
- JavaScript
- CSS

### Backend

- Python
- FastAPI
- Uvicorn
- Pydantic

---

## Структура проекта

```text
Vocabulary_App/
  backend/
    data/
      animals.json
      food.json
      basic.json
      verbs.json
      adjectives.json
    main.py
    requirements.txt

  frontend/
    src/
      components/
        AnswerForm.jsx
        CategorySelect.jsx
        MatchingTask.jsx
        ResultMessage.jsx
        SessionHistory.jsx
        SessionSummary.jsx
        TaskCard.jsx
        TrainingModeSelect.jsx
      App.jsx
      index.css
      main.jsx
    package.json
    vite.config.js

  README.md
  .gitignore