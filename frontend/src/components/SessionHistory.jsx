function SessionHistory({ sessions, onClearHistory }) {
  function createTxtContent() {
    if (sessions.length === 0) {
      return "История тренировок пуста.";
    }

    return sessions
      .map((session, sessionIndex) => {
        const date = new Date(session.startedAt).toLocaleString("ru-RU");

        const answersText = session.history
          .map((answer, answerIndex) => {
            const status = answer.correct ? "Верно" : "Ошибка";

            return [
              `${answerIndex + 1}. ${status}`,
              `   Задание: ${answer.instruction}`,
              `   Вопрос: ${answer.question}`,
              `   Твой ответ: ${answer.userAnswer}`,
              `   Правильный ответ: ${answer.correctAnswer}`,
            ].join("\n");
          })
          .join("\n\n");

        const mistakesText =
          session.mistakes.length > 0
            ? session.mistakes
                .map((mistake, mistakeIndex) => {
                  return [
                    `${mistakeIndex + 1}. Задание: ${mistake.instruction}`,
                    `   Вопрос: ${mistake.question}`,
                    `   Твой ответ: ${mistake.userAnswer}`,
                    `   Правильно: ${mistake.correctAnswer}`,
                  ].join("\n");
                })
                .join("\n\n")
            : "Ошибок нет.";

        return [
          `Сессия ${sessionIndex + 1}`,
          `Дата и время: ${date}`,
          `Всего заданий: ${session.total}`,
          `Верных ответов: ${session.correct}`,
          `Ошибок: ${session.mistakes.length}`,
          "",
          "Все ответы:",
          answersText,
          "",
          "Ошибки:",
          mistakesText,
        ].join("\n");
      })
      .join("\n\n------------------------------\n\n");
  }

  function downloadTxtFile() {
    const content = createTxtContent();
    const blob = new Blob([content], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "vocabulary_sessions.txt";
    link.click();

    URL.revokeObjectURL(url);
  }

  if (sessions.length === 0) {
    return (
      <section className="history">
        <h3>История тренировок</h3>
        <p className="historyEmpty">Пока нет сохранённых тренировок.</p>
      </section>
    );
  }

  return (
    <section className="history">
      <div className="historyHeader">
        <h3>История тренировок</h3>

        <div className="historyActions">
          <button className="downloadButton" onClick={downloadTxtFile}>
            Скачать TXT
          </button>

          <button className="clearButton" onClick={onClearHistory}>
            Очистить
          </button>
        </div>
      </div>

      <div className="historyList">
        {sessions.map((session) => (
          <div className="historyItem" key={session.id}>
            <p>
              <strong>
                {new Date(session.startedAt).toLocaleString("ru-RU")}
              </strong>
            </p>

            <p>
              Результат: {session.correct} / {session.total}
            </p>

            <p>Ошибок: {session.mistakes.length}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default SessionHistory;