import { useEffect, useState } from "react";
import AppSectionSelect from "./components/AppSectionSelect";
import TrainingModeSelect from "./components/TrainingModeSelect";
import MatchingTask from "./components/MatchingTask";
import CategorySelect from "./components/CategorySelect";
import TaskCard from "./components/TaskCard";
import AnswerForm from "./components/AnswerForm";
import ResultMessage from "./components/ResultMessage";
import SessionSummary from "./components/SessionSummary";
import SessionHistory from "./components/SessionHistory";
import SeriesGrid from "./components/phrases/SeriesGrid";
import PhraseTrainer from "./components/phrases/PhraseTrainer";
import PhraseFilters from "./components/phrases/PhraseFilters";

const API_URL = "http://127.0.0.1:8000";
const TASKS_LIMIT = 10;
const STORAGE_KEY = "vocabulary_sessions";

function App() {
  const [appSection, setAppSection] = useState("words");

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [trainingMode, setTrainingMode] = useState("translation");
  const [matchingTask, setMatchingTask] = useState(null);
  const [matchingAnswers, setMatchingAnswers] = useState({});
  const [matchingResult, setMatchingResult] = useState(null);

  const [task, setTask] = useState(null);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null);

  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);

  const [answersHistory, setAnswersHistory] = useState([]);
  const [sessionStartedAt, setSessionStartedAt] = useState(null);
  const [sessionFinished, setSessionFinished] = useState(false);
  const [savedSessions, setSavedSessions] = useState([]);

  const [phraseSeries, setPhraseSeries] = useState([]);
  const [selectedPhraseSeries, setSelectedPhraseSeries] = useState(null);
  const [phraseStep, setPhraseStep] = useState("series");

  const [phraseFilters, setPhraseFilters] = useState({
    seasons: [],
    episodes: [],
    levels: [],
    tags: [],
  });

  const [selectedPhraseSeason, setSelectedPhraseSeason] = useState(null);
  const [selectedPhraseEpisodes, setSelectedPhraseEpisodes] = useState([]);
  const [selectedPhraseLevels, setSelectedPhraseLevels] = useState([]);
  const [selectedPhraseTags, setSelectedPhraseTags] = useState([]);

  const [phraseTask, setPhraseTask] = useState(null);
  const [phraseAnswer, setPhraseAnswer] = useState("");
  const [phraseResult, setPhraseResult] = useState(null);
  const [phraseError, setPhraseError] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  function loadSavedSessions() {
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (!savedData) {
      return [];
    }

    try {
      return JSON.parse(savedData);
    } catch {
      return [];
    }
  }

  function getCategoryLabel(categoryValue) {
    const category = categories.find((item) => item.value === categoryValue);
    return category ? category.label : "Все слова";
  }

  function saveSession(history, startedAt, categoryValue) {
    const correctAnswers = history.filter((item) => item.correct).length;
    const mistakes = history.filter((item) => !item.correct);

    const newSession = {
      id: startedAt,
      startedAt,
      category: categoryValue,
      categoryLabel: getCategoryLabel(categoryValue),
      total: history.length,
      correct: correctAnswers,
      mistakes,
      history,
    };

    const currentSessions = loadSavedSessions();
    const updatedSessions = [newSession, ...currentSessions];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSessions));
    setSavedSessions(updatedSessions);
  }

  async function loadTask(category = selectedCategory) {
    setIsLoading(true);
    setError("");
    setResult(null);
    setAnswer("");
    setTask(null);

    try {
      const response = await fetch(`${API_URL}/task?category=${category}`);

      if (!response.ok) {
        throw new Error("Не удалось загрузить задание");
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setTask(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function loadMatchingTask(category = selectedCategory) {
    setIsLoading(true);
    setError("");
    setMatchingResult(null);
    setMatchingAnswers({});
    setMatchingTask(null);

    try {
      const response = await fetch(
        `${API_URL}/matching-task?category=${category}`
      );

      if (!response.ok) {
        throw new Error("Не удалось загрузить задание на сопоставление");
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setMatchingTask(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function loadCategories() {
    try {
      const response = await fetch(`${API_URL}/categories`);

      if (!response.ok) {
        throw new Error("Не удалось загрузить категории");
      }

      const data = await response.json();
      setCategories(data);
    } catch (error) {
      setError(error.message);
    }
  }

  async function loadPhraseSeries() {
    try {
      const response = await fetch(`${API_URL}/phrase-series`);

      if (!response.ok) {
        throw new Error("Не удалось загрузить список сериалов");
      }

      const data = await response.json();
      setPhraseSeries(data);
    } catch (error) {
      setPhraseError(error.message);
    }
  }

  async function loadPhraseFilters(seriesId) {
    setPhraseError("");

    try {
      const response = await fetch(`${API_URL}/phrase-filters?series=${seriesId}`);

      if (!response.ok) {
        throw new Error("Не удалось загрузить фильтры");
      }

      const data = await response.json();

      setPhraseFilters(data);

      const firstSeason = data.seasons[0] ?? null;
      setSelectedPhraseSeason(firstSeason);

      const seasonEpisodes = data.episodes
        .filter((item) => item.season === firstSeason)
        .map((item) => item.episode);

      setSelectedPhraseEpisodes(seasonEpisodes);
      setSelectedPhraseLevels(data.levels);
      setSelectedPhraseTags([]);
    } catch (error) {
      setPhraseError(error.message);
    }
  }

  function toggleValue(value, selectedValues, setSelectedValues) {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter((item) => item !== value));
    } else {
      setSelectedValues([...selectedValues, value]);
    }
  }

  function handleSeasonChange(season) {
    setSelectedPhraseSeason(season);

    const seasonEpisodes = phraseFilters.episodes
      .filter((item) => item.season === season)
      .map((item) => item.episode);

    setSelectedPhraseEpisodes(seasonEpisodes);
  }

  function selectAllEpisodes() {
    const seasonEpisodes = phraseFilters.episodes
      .filter((item) => item.season === selectedPhraseSeason)
      .map((item) => item.episode);

    setSelectedPhraseEpisodes(seasonEpisodes);
  }

  function selectAllLevels() {
    setSelectedPhraseLevels(phraseFilters.levels);
  }

  function selectAllTags() {
    setSelectedPhraseTags([]);
  }

  function buildPhraseTaskUrl(seriesId) {
    const params = new URLSearchParams();

    params.set("series", seriesId);

    if (selectedPhraseSeason) {
      params.set("season", selectedPhraseSeason);
    }

    if (selectedPhraseEpisodes.length > 0) {
      params.set("episodes", selectedPhraseEpisodes.join(","));
    }

    if (selectedPhraseLevels.length > 0) {
      params.set("levels", selectedPhraseLevels.join(","));
    }

    if (selectedPhraseTags.length > 0) {
      params.set("tags", selectedPhraseTags.join(","));
    }

    return `${API_URL}/phrase-task?${params.toString()}`;
  }

  async function loadPhraseTask(seriesId) {
    setPhraseTask(null);
    setPhraseAnswer("");
    setPhraseResult(null);
    setPhraseError("");

    try {
      const response = await fetch(buildPhraseTaskUrl(seriesId));

      if (!response.ok) {
        throw new Error("Не удалось загрузить фразу");
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setPhraseTask(data);
    } catch (error) {
      setPhraseError(error.message);
    }
  }

  function selectPhraseSeries(series) {
    setSelectedPhraseSeries(series);
    setPhraseStep("filters");
    loadPhraseFilters(series.id);
  }

  function startPhraseTraining() {
    if (!selectedPhraseSeries) return;

    if (selectedPhraseEpisodes.length === 0) {
      setPhraseError("Выбери хотя бы одну серию");
      return;
    }

    if (selectedPhraseLevels.length === 0) {
      setPhraseError("Выбери хотя бы один уровень");
      return;
    }

    setPhraseStep("trainer");
    loadPhraseTask(selectedPhraseSeries.id);
  }

  async function checkPhraseAnswer(answerOverride) {
    if (!phraseTask) return;

    const finalAnswer = answerOverride ?? phraseAnswer;

    if (!finalAnswer.trim()) {
      if (phraseTask.type === "phrase_choice") {
        setPhraseError("Выбери вариант ответа");
      } else {
        setPhraseError("Введите перевод");
      }

      return;
    }

    setPhraseAnswer(finalAnswer);
    setPhraseError("");

    try {
      const response = await fetch(`${API_URL}/check-phrase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phrase_id: phraseTask.phrase_id,
          answer: finalAnswer,
        }),
      });

      if (!response.ok) {
        throw new Error("Не удалось проверить фразу");
      }

      const data = await response.json();
      setPhraseResult(data);
    } catch (error) {
      setPhraseError(error.message);
    }
  }

  function goNextPhrase() {
    if (!selectedPhraseSeries) return;
    loadPhraseTask(selectedPhraseSeries.id);
  }

  function goBackToSeries() {
    setSelectedPhraseSeries(null);
    setPhraseStep("series");
    setPhraseTask(null);
    setPhraseAnswer("");
    setPhraseResult(null);
    setPhraseError("");
  }

  function goBackToFilters() {
    setPhraseStep("filters");
    setPhraseTask(null);
    setPhraseAnswer("");
    setPhraseResult(null);
    setPhraseError("");
  }

  function restartSession(category = selectedCategory, mode = trainingMode) {
    const startedAt = new Date().toISOString();

    setTask(null);
    setMatchingTask(null);
    setAnswer("");
    setResult(null);
    setMatchingResult(null);
    setMatchingAnswers({});
    setScore(0);
    setTotal(0);
    setAnswersHistory([]);
    setSessionFinished(false);
    setSessionStartedAt(startedAt);
    setError("");

    if (mode === "matching") {
      loadMatchingTask(category);
    } else {
      loadTask(category);
    }
  }

  async function checkAnswer(userAnswer) {
    if (!task || result) return;

    const finalAnswer = userAnswer ?? answer;

    if (!finalAnswer.trim()) {
      setError("Введите ответ");
      return;
    }

    setError("");

    try {
      const response = await fetch(`${API_URL}/check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          word_id: task.word_id,
          task_type: task.type,
          answer: finalAnswer,
        }),
      });

      if (!response.ok) {
        throw new Error("Не удалось проверить ответ");
      }

      const data = await response.json();

      const historyItem = {
        instruction: task.instruction,
        question: task.question,
        taskType: task.type,
        userAnswer: finalAnswer,
        correctAnswer: data.correct_answer,
        correct: data.correct,
        category: selectedCategory,
        categoryLabel: getCategoryLabel(selectedCategory),
      };

      setResult(data);

      const updatedHistory = [...answersHistory, historyItem];
      setAnswersHistory(updatedHistory);

      setTotal((prevTotal) => prevTotal + 1);

      if (data.correct) {
        setScore((prevScore) => prevScore + 1);
      }

      if (updatedHistory.length >= TASKS_LIMIT && sessionStartedAt) {
        saveSession(updatedHistory, sessionStartedAt, selectedCategory);
      }
    } catch (error) {
      setError(error.message);
    }
  }

  function handleMatchingAnswerChange(wordId, selectedTranslationId) {
    setMatchingAnswers((prevAnswers) => ({
      ...prevAnswers,
      [wordId]: selectedTranslationId,
    }));
  }

  async function checkMatchingAnswers() {
    if (!matchingTask) return;

    if (Object.keys(matchingAnswers).length !== matchingTask.items.length) {
      setError("Выбери перевод для каждого слова");
      return;
    }

    setError("");

    try {
      const response = await fetch(`${API_URL}/check-matching`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answers: matchingAnswers,
        }),
      });

      if (!response.ok) {
        throw new Error("Не удалось проверить сопоставление");
      }

      const data = await response.json();
      setMatchingResult(data);
    } catch (error) {
      setError(error.message);
    }
  }

  function goNextMatching() {
    loadMatchingTask(selectedCategory);
  }

  function goNext() {
    if (total >= TASKS_LIMIT) {
      setSessionFinished(true);
      return;
    }

    loadTask(selectedCategory);
  }

  function clearHistory() {
    localStorage.removeItem(STORAGE_KEY);
    setSavedSessions([]);
  }

  useEffect(() => {
    setSavedSessions(loadSavedSessions());

    const startedAt = new Date().toISOString();
    setSessionStartedAt(startedAt);

    loadCategories();
    loadTask();
    loadPhraseSeries();
  }, []);

  if (sessionFinished) {
    return (
      <div className="app">
        <main className="card">
          <SessionSummary
            startedAt={sessionStartedAt}
            history={answersHistory}
            onRestart={() => restartSession(selectedCategory, trainingMode)}
          />

          <SessionHistory
            sessions={savedSessions}
            onClearHistory={clearHistory}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <main className="card">
        <p className="tag">English Vocabulary Trainer</p>

        <h1>Тренажёр английского</h1>

        <AppSectionSelect
          appSection={appSection}
          onChange={(newSection) => {
            setAppSection(newSection);
            setError("");
            setPhraseError("");
          }}
        />

        {appSection === "phrases" && (
          <>
            {phraseStep === "series" && (
              <SeriesGrid
                seriesList={phraseSeries}
                onSelectSeries={selectPhraseSeries}
              />
            )}

            {phraseStep === "filters" && selectedPhraseSeries && (
              <PhraseFilters
                selectedSeries={selectedPhraseSeries}
                filters={phraseFilters}
                selectedSeason={selectedPhraseSeason}
                selectedEpisodes={selectedPhraseEpisodes}
                selectedLevels={selectedPhraseLevels}
                selectedTags={selectedPhraseTags}
                onSeasonChange={handleSeasonChange}
                onEpisodeToggle={(episode) =>
                  toggleValue(
                    episode,
                    selectedPhraseEpisodes,
                    setSelectedPhraseEpisodes
                  )
                }
                onLevelToggle={(level) =>
                  toggleValue(level, selectedPhraseLevels, setSelectedPhraseLevels)
                }
                onTagToggle={(tag) =>
                  toggleValue(tag, selectedPhraseTags, setSelectedPhraseTags)
                }
                onSelectAllEpisodes={selectAllEpisodes}
                onSelectAllLevels={selectAllLevels}
                onSelectAllTags={selectAllTags}
                onStart={startPhraseTraining}
                onBack={goBackToSeries}
              />
            )}

            {phraseStep === "trainer" && selectedPhraseSeries && (
              <PhraseTrainer
                selectedSeries={selectedPhraseSeries}
                phraseTask={phraseTask}
                phraseAnswer={phraseAnswer}
                phraseResult={phraseResult}
                phraseError={phraseError}
                onAnswerChange={setPhraseAnswer}
                onCheck={checkPhraseAnswer}
                onNext={goNextPhrase}
                onBack={goBackToFilters}
              />
            )}
          </>
        )}

        {appSection === "words" && (
          <>
            <CategorySelect
              categories={categories}
              selectedCategory={selectedCategory}
              onChange={(newCategory) => {
                setSelectedCategory(newCategory);
                restartSession(newCategory, trainingMode);
              }}
            />

            <TrainingModeSelect
              trainingMode={trainingMode}
              onChange={(newMode) => {
                setTrainingMode(newMode);
                restartSession(selectedCategory, newMode);
              }}
            />

            {trainingMode === "translation" && (
              <>
                <div className="score">
                  Задание: <span>{Math.min(total + 1, TASKS_LIMIT)}</span> /{" "}
                  {TASKS_LIMIT}
                </div>

                <div className="score">
                  Счёт: <span>{score}</span> / {total}
                </div>
              </>
            )}

            {isLoading && <p className="message">Загрузка задания...</p>}

            {error && <p className="error">{error}</p>}

            {!isLoading && trainingMode === "translation" && task && (
              <>
                <TaskCard task={task} />

                <AnswerForm
                  task={task}
                  answer={answer}
                  setAnswer={setAnswer}
                  result={result}
                  onCheckAnswer={checkAnswer}
                  onNext={goNext}
                />

                <ResultMessage result={result} />

                {result && (
                  <button className="nextButton" onClick={goNext}>
                    {total >= TASKS_LIMIT
                      ? "Показать результат"
                      : "Следующее задание"}
                  </button>
                )}
              </>
            )}

            {!isLoading && trainingMode === "matching" && matchingTask && (
              <MatchingTask
                task={matchingTask}
                answers={matchingAnswers}
                result={matchingResult}
                onAnswerChange={handleMatchingAnswerChange}
                onCheck={checkMatchingAnswers}
                onNext={goNextMatching}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;