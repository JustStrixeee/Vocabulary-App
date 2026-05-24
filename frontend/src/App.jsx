import { useEffect, useState } from "react";
import TaskCard from "./components/TaskCard";
import AnswerForm from "./components/AnswerForm";
import ResultMessage from "./components/ResultMessage";
import SessionSummary from "./components/SessionSummary";

const API_URL = "http://127.0.0.1:8000";
const TASKS_LIMIT = 10;

function App() {
  const [task, setTask] = useState(null);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null);

  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);

  const [answersHistory, setAnswersHistory] = useState([]);
  const [sessionStartedAt, setSessionStartedAt] = useState(null);
  const [sessionFinished, setSessionFinished] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadTask() {
    setIsLoading(true);
    setError("");
    setResult(null);
    setAnswer("");

    try {
      const response = await fetch(`${API_URL}/task`);

      if (!response.ok) {
        throw new Error("Не удалось загрузить задание");
      }

      const data = await response.json();
      setTask(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  function restartSession() {
    setTask(null);
    setAnswer("");
    setResult(null);
    setScore(0);
    setTotal(0);
    setAnswersHistory([]);
    setSessionFinished(false);
    setSessionStartedAt(new Date().toISOString());
    loadTask();
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
      };

      setResult(data);
      setAnswersHistory((prevHistory) => [...prevHistory, historyItem]);

      setTotal((prevTotal) => prevTotal + 1);

      if (data.correct) {
        setScore((prevScore) => prevScore + 1);
      }
    } catch (error) {
      setError(error.message);
    }
  }

  function goNext() {
    if (total >= TASKS_LIMIT) {
      setSessionFinished(true);
      return;
    }

    loadTask();
  }

  useEffect(() => {
    setSessionStartedAt(new Date().toISOString());
    loadTask();
  }, []);

  if (sessionFinished) {
    return (
      <div className="app">
        <main className="card">
          <SessionSummary
            startedAt={sessionStartedAt}
            history={answersHistory}
            onRestart={restartSession}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <main className="card">
        <p className="tag">English Vocabulary Trainer</p>

        <h1>Тренажёр английских слов</h1>

        <div className="score">
          Задание: <span>{Math.min(total + 1, TASKS_LIMIT)}</span> /{" "}
          {TASKS_LIMIT}
        </div>

        <div className="score">
          Счёт: <span>{score}</span> / {total}
        </div>

        {isLoading && <p className="message">Загрузка задания...</p>}

        {error && <p className="error">{error}</p>}

        {!isLoading && task && (
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
      </main>
    </div>
  );
}

export default App;