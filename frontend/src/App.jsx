import { useEffect, useState } from "react";
import "./index.css";

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
      setTotal((prev) => prev + 1);

      if (data.correct) {
        setScore((prev) => prev + 1);
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
            <section className="task">
              <p className="instruction">{task.instruction}</p>
              <h2>{task.question}</h2>
            </section>

            {task.type === "choice" ? (
              <div className="options">
                {task.options.map((option) => (
                  <button
                    key={option}
                    className="optionButton"
                    onClick={() => checkAnswer(option)}
                    disabled={Boolean(result)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : (
              <div className="answerBox">
                <input
                  value={answer}
                  onChange={(event) => setAnswer(event.target.value)}
                  placeholder="Введите перевод"
                  disabled={Boolean(result)}
                />

                <button onClick={() => checkAnswer()} disabled={Boolean(result)}>
                  Проверить
                </button>
              </div>
            )}

            {result && (
              <div className={result.correct ? "result success" : "result fail"}>
                {result.correct ? (
                  <p>✅ Правильно!</p>
                ) : (
                  <p>
                    ❌ Неправильно. Правильный ответ:{" "}
                    <strong>{result.correct_answer}</strong>
                  </p>
                )}
              </div>
            )}

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