import { useEffect, useState } from "react";
import TaskCard from "./components/TaskCard";
import AnswerForm from "./components/AnswerForm";
import ResultMessage from "./components/ResultMessage";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [task, setTask] = useState(null);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
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

  async function checkAnswer(userAnswer) {
    if (!task) return;

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

      setResult(data);
      setTotal((prevTotal) => prevTotal + 1);

      if (data.correct) {
        setScore((prevScore) => prevScore + 1);
      }
    } catch (error) {
      setError(error.message);
    }
  }

  useEffect(() => {
    loadTask();
  }, []);

  return (
    <div className="app">
      <main className="card">
        <p className="tag">English Vocabulary Trainer</p>

        <h1>Тренажёр английских слов</h1>

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
            />

            <ResultMessage result={result} />

            <button className="nextButton" onClick={loadTask}>
              Следующее задание
            </button>
          </>
        )}
      </main>
    </div>
  );
}

export default App;