function SessionSummary({ startedAt, history, onRestart }) {
  const correctAnswers = history.filter((item) => item.correct).length;
  const mistakes = history.filter((item) => !item.correct);

  const formattedDate = startedAt
    ? new Date(startedAt).toLocaleString("ru-RU")
    : "";

  return (
    <section className="summary">
      <p className="tag">Session result</p>

      <h2>Результат тренировки</h2>

      <div className="summaryGrid">
        <div>
          <span>Дата и время</span>
          <strong>{formattedDate}</strong>
        </div>

        <div>
          <span>Всего заданий</span>
          <strong>{history.length}</strong>
        </div>

        <div>
          <span>Верных ответов</span>
          <strong>{correctAnswers}</strong>
        </div>

        <div>
          <span>Ошибок</span>
          <strong>{mistakes.length}</strong>
        </div>
      </div>

      {mistakes.length > 0 ? (
        <div className="mistakes">
          <h3>Ошибки</h3>

          {mistakes.map((item, index) => (
            <div className="mistakeItem" key={`${item.question}-${index}`}>
              <p>
                <strong>Задание:</strong> {item.instruction}
              </p>
              <p>
                <strong>Вопрос:</strong> {item.question}
              </p>
              <p>
                <strong>Твой ответ:</strong> {item.userAnswer}
              </p>
              <p>
                <strong>Правильно:</strong> {item.correctAnswer}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="successText">Все ответы правильные 🔥</p>
      )}

      <button className="nextButton" onClick={onRestart}>
        Начать заново
      </button>
    </section>
  );
}

export default SessionSummary;