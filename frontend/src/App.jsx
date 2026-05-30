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
import PhraseMatchingTask from "./components/phrases/PhraseMatchingTask";
import ComboEffect from "./components/effects/ComboEffect";
import SandTrapEffect from "./components/effects/SandTrapEffect";
import SandRelic from "./components/effects/SandRelic";
import LightningEffect from "./components/effects/LightningEffect";
import LightningRelic from "./components/effects/LightningRelic";
import IceEffect from "./components/effects/IceEffect";
import IceRelic from "./components/effects/IceRelic";
import FireballEffect from "./components/effects/FireballEffect";
import FireballRelic from "./components/effects/FireballRelic";
import EclipseEffect from "./components/effects/EclipseEffect";
import EclipseRelic from "./components/effects/EclipseRelic";
import HurricaneEffect from "./components/effects/HurricaneEffect";
import HurricaneRelic from "./components/effects/HurricaneRelic";
import BlackHoleEffect from "./components/effects/BlackHoleEffect";
import BlackHoleRelic from "./components/effects/BlackHoleRelic";
import MatrixEffect from "./components/effects/MatrixEffect";
import MatrixRelic from "./components/effects/MatrixRelic";

const API_URL = "http://127.0.0.1:8000";
const TASKS_LIMIT = 10;
const STORAGE_KEY = "vocabulary_sessions";
const ULTIMATE_TRIGGER_STEP = 5;

const ULTIMATE_TYPES = [
  "sand",
  "lightning",
  "ice",
  "fireball",
  "eclipse",
  "hurricane",
  "blackHole",
  "matrix",
];

const ULTIMATE_COMPONENTS = {
  sand: {
    Effect: SandTrapEffect,
    Relic: SandRelic,
  },
  lightning: {
    Effect: LightningEffect,
    Relic: LightningRelic,
  },
  ice: {
    Effect: IceEffect,
    Relic: IceRelic,
  },
  fireball: {
    Effect: FireballEffect,
    Relic: FireballRelic,
  },
  eclipse: {
    Effect: EclipseEffect,
    Relic: EclipseRelic,
  },
  hurricane: {
    Effect: HurricaneEffect,
    Relic: HurricaneRelic,
  },
  blackHole: {
    Effect: BlackHoleEffect,
    Relic: BlackHoleRelic,
  },
  matrix: {
    Effect: MatrixEffect,
    Relic: MatrixRelic,
  },
};

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

  const [phraseTrainingType, setPhraseTrainingType] = useState("regular");

  const [selectedPhraseSeason, setSelectedPhraseSeason] = useState(null);
  const [selectedPhraseEpisodes, setSelectedPhraseEpisodes] = useState([]);
  const [selectedPhraseLevels, setSelectedPhraseLevels] = useState([]);
  const [selectedPhraseTags, setSelectedPhraseTags] = useState([]);

  const [phraseTask, setPhraseTask] = useState(null);
  const [phraseAnswer, setPhraseAnswer] = useState("");
  const [phraseResult, setPhraseResult] = useState(null);

  const [phraseMatchingTask, setPhraseMatchingTask] = useState(null);
  const [phraseMatchingAnswers, setPhraseMatchingAnswers] = useState({});
  const [phraseMatchingResult, setPhraseMatchingResult] = useState(null);

  const [phraseError, setPhraseError] = useState("");

  const [comboStreak, setComboStreak] = useState(0);
  const [comboVisible, setComboVisible] = useState(false);
  const [activeUltimate, setActiveUltimate] = useState(null);
  const [visibleRelic, setVisibleRelic] = useState(null);
  const [lastUltimate, setLastUltimate] = useState(null);

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

  function triggerComboEffect(nextStreak) {
    if (nextStreak < 2) {
      return;
    }

    setComboVisible(true);

    setTimeout(() => {
      setComboVisible(false);
    }, 1800);
  }

  function getRandomUltimate(excludedUltimate) {
    const availableUltimates = ULTIMATE_TYPES.filter(
      (type) => type !== excludedUltimate
    );

    const randomIndex = Math.floor(Math.random() * availableUltimates.length);

    return availableUltimates[randomIndex];
  }

  function triggerRandomUltimateEffect(nextStreak) {
    if (nextStreak < ULTIMATE_TRIGGER_STEP) {
      return;
    }

    if (nextStreak % ULTIMATE_TRIGGER_STEP !== 0) {
      return;
    }

    const selectedUltimate = getRandomUltimate(lastUltimate);

    setActiveUltimate(selectedUltimate);
    setLastUltimate(selectedUltimate);
  }

  function handleComboResult(isSuccess) {
    if (!isSuccess) {
      setComboStreak(0);
      setComboVisible(false);
      setActiveUltimate(null);
      return;
    }

    setComboStreak((prevStreak) => {
      const nextStreak = prevStreak + 1;

      triggerRandomUltimateEffect(nextStreak);
      triggerRandomUltimateEffect(nextStreak);

      return nextStreak;
    });
  }

  function handleMatchingComboResult(correct, totalCount) {
    const isPerfect = correct === totalCount;
    handleComboResult(isPerfect);
  }

  function resetCombo() {
    setComboStreak(0);
    setComboVisible(false);
    setActiveUltimate(null);
    setVisibleRelic(null);
    setLastUltimate(null);
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
      const response = await fetch(
        `${API_URL}/phrase-filters?series=${seriesId}`
      );

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

  function selectEpisodeRange(start, end) {
    const episodes = [];

    for (let episode = start; episode <= end; episode += 1) {
      episodes.push(episode);
    }

    setSelectedPhraseEpisodes(episodes);
  }

  function selectAllLevels() {
    setSelectedPhraseLevels(phraseFilters.levels);
  }

  function selectAllTags() {
    setSelectedPhraseTags([]);
  }

  function buildPhraseTaskParams() {
    const params = new URLSearchParams();

    if (selectedPhraseSeries) {
      params.set("series", selectedPhraseSeries.id);
    }

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

    return params.toString();
  }

  async function loadPhraseTask() {
    setPhraseTask(null);
    setPhraseAnswer("");
    setPhraseResult(null);
    setPhraseError("");

    try {
      const response = await fetch(
        `${API_URL}/phrase-task?${buildPhraseTaskParams()}`
      );

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

  async function loadPhraseMatchingTask() {
    setPhraseMatchingTask(null);
    setPhraseMatchingAnswers({});
    setPhraseMatchingResult(null);
    setPhraseError("");

    try {
      const response = await fetch(
        `${API_URL}/phrase-matching-task?${buildPhraseTaskParams()}`
      );

      if (!response.ok) {
        throw new Error("Не удалось загрузить сопоставление фраз");
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setPhraseMatchingTask(data);
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

    resetCombo();
    setPhraseStep("trainer");

    if (phraseTrainingType === "matching") {
      loadPhraseMatchingTask();
    } else {
      loadPhraseTask();
    }
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
      handleComboResult(data.correct);
    } catch (error) {
      setPhraseError(error.message);
    }
  }

  function handlePhraseMatchingAnswerChange(phraseId, selectedTranslationId) {
    setPhraseMatchingAnswers((prevAnswers) => ({
      ...prevAnswers,
      [phraseId]: selectedTranslationId,
    }));
  }

  async function checkPhraseMatchingAnswers() {
    if (!phraseMatchingTask) return;

    if (
      Object.keys(phraseMatchingAnswers).length !==
      phraseMatchingTask.items.length
    ) {
      setPhraseError("Выбери перевод для каждой фразы");
      return;
    }

    setPhraseError("");

    try {
      const response = await fetch(`${API_URL}/check-phrase-matching`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answers: phraseMatchingAnswers,
        }),
      });

      if (!response.ok) {
        throw new Error("Не удалось проверить сопоставление фраз");
      }

      const data = await response.json();
      setPhraseMatchingResult(data);
      handleMatchingComboResult(data.correct, data.total);
    } catch (error) {
      setPhraseError(error.message);
    }
  }

  function goNextPhrase() {
    loadPhraseTask();
  }

  function goNextPhraseMatching() {
    loadPhraseMatchingTask();
  }

  function goBackToSeries() {
    setSelectedPhraseSeries(null);
    setPhraseStep("series");
    setPhraseTask(null);
    setPhraseAnswer("");
    setPhraseResult(null);
    setPhraseMatchingTask(null);
    setPhraseMatchingAnswers({});
    setPhraseMatchingResult(null);
    setPhraseError("");
    resetCombo();
  }

  function goBackToFilters() {
    setPhraseStep("filters");
    setPhraseTask(null);
    setPhraseAnswer("");
    setPhraseResult(null);
    setPhraseMatchingTask(null);
    setPhraseMatchingAnswers({});
    setPhraseMatchingResult(null);
    setPhraseError("");
    resetCombo();
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
    resetCombo();

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
      handleComboResult(data.correct);

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
      handleMatchingComboResult(data.correct, data.total);
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

  function renderUltimateEffect() {
    const activeConfig = activeUltimate
      ? ULTIMATE_COMPONENTS[activeUltimate]
      : null;

    const relicConfig = visibleRelic ? ULTIMATE_COMPONENTS[visibleRelic] : null;

    const ActiveEffect = activeConfig?.Effect;
    const ActiveRelic = relicConfig?.Relic;

    return (
      <>
        {ActiveEffect && (
          <ActiveEffect
            visible={Boolean(activeUltimate)}
            streak={comboStreak}
            onComplete={() => {
              setVisibleRelic(activeUltimate);
              setActiveUltimate(null);
            }}
          />
        )}

        {ActiveRelic && <ActiveRelic visible />}
      </>
    );
  }

  if (sessionFinished) {
    return (
      <div className="app">
        <main className="card">
          <ComboEffect streak={comboStreak} visible={comboVisible} />

          {renderUltimateEffect()}

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
        <ComboEffect streak={comboStreak} visible={comboVisible} />

        {renderUltimateEffect()}

        <p className="tag">English Vocabulary Trainer</p>

        <h1>Тренажёр английского</h1>

        <AppSectionSelect
          appSection={appSection}
          onChange={(newSection) => {
            setAppSection(newSection);
            setError("");
            setPhraseError("");
            resetCombo();
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
                phraseTrainingType={phraseTrainingType}
                onTrainingTypeChange={setPhraseTrainingType}
                onSeasonChange={handleSeasonChange}
                onEpisodeRangeSelect={selectEpisodeRange}
                onLevelToggle={(level) =>
                  toggleValue(
                    level,
                    selectedPhraseLevels,
                    setSelectedPhraseLevels
                  )
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

            {phraseStep === "trainer" &&
              selectedPhraseSeries &&
              phraseTrainingType === "regular" && (
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

            {phraseStep === "trainer" &&
              selectedPhraseSeries &&
              phraseTrainingType === "matching" && (
                <PhraseMatchingTask
                  task={phraseMatchingTask}
                  answers={phraseMatchingAnswers}
                  result={phraseMatchingResult}
                  error={phraseError}
                  onAnswerChange={handlePhraseMatchingAnswerChange}
                  onCheck={checkPhraseMatchingAnswers}
                  onNext={goNextPhraseMatching}
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

                <div className="score">
                  Серия: <span>{comboStreak}</span>
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