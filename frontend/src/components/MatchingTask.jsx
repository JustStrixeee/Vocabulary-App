function MatchingTask({
  task,
  answers,
  result,
  onAnswerChange,
  onCheck,
  onNext,
}) {
  if (!task) {
    return null;
  }

  return (
    <section className="matching">
      <div className="task">
        <p className="instruction">{task.instruction}</p>
        <h2>Сопоставление</h2>
      </div>

      <div className="matchingList">
        {task.items.map((item) => {
          const itemResult = result?.results.find(
            (resultItem) => resultItem.word_id === item.id
          );

          return (
            <div className="matchingRow" key={item.id}>
              <div>
                <strong>{item.english}</strong>

                {itemResult && (
                  <p className={itemResult.correct ? "miniSuccess" : "miniFail"}>
                    {itemResult.correct
                      ? "Верно"
                      : `Правильно: ${itemResult.correct_answer}`}
                  </p>
                )}
              </div>

              <select
                value={answers[item.id] || ""}
                onChange={(event) =>
                  onAnswerChange(item.id, event.target.value)
                }
                disabled={Boolean(result)}
              >
                <option value="">Выбери перевод</option>

                {task.options.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.russian}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>

      {result && (
        <div className="result success">
          <p>
            Результат: <strong>{result.correct}</strong> / {result.total}
          </p>
        </div>
      )}

      {!result ? (
        <button className="nextButton" onClick={onCheck}>
          Проверить
        </button>
      ) : (
        <button className="nextButton" onClick={onNext}>
          Следующее задание
        </button>
      )}
    </section>
  );
}

export default MatchingTask;