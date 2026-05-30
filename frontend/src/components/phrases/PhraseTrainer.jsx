function PhraseTrainer({
  selectedSeries,
  phraseTask,
  phraseAnswer,
  phraseResult,
  phraseError,
  onAnswerChange,
  onCheck,
  onNext,
  onBack,
}) {
  if (!selectedSeries) {
    return null;
  }

  return (
    <section className="phraseTrainer">
      <button className="backButton" onClick={onBack}>
        ← Назад к сериалам
      </button>

      <p className="tag">Phrase Trainer</p>

      <h2>{selectedSeries.russian_title}</h2>

      <p className="phraseMeta">
        {selectedSeries.title}
        {phraseTask && (
          <>
            {" "}
            · {phraseTask.episode_code} · {phraseTask.level}
          </>
        )}
      </p>

      {phraseError && <p className="error">{phraseError}</p>}

      {phraseTask ? (
        <>
          <div className="phraseCard">
            <p className="instruction">{phraseTask.instruction}</p>
            <h3>{phraseTask.english}</h3>
          </div>

          {phraseTask.type === "phrase_choice" ? (
            <div className="phraseOptions">
              {phraseTask.options.map((option) => (
                <button
                  key={option.id}
                  className="optionButton"
                  onClick={() => onCheck(option.russian)}
                  disabled={Boolean(phraseResult)}
                >
                  {option.russian}
                </button>
              ))}
            </div>
          ) : (
            <form
              className="answerBox"
              onSubmit={(event) => {
                event.preventDefault();

                if (phraseResult) {
                  onNext();
                } else {
                  onCheck();
                }
              }}
            >
              <input
                value={phraseAnswer}
                onChange={(event) => onAnswerChange(event.target.value)}
                placeholder="Введите перевод"
                readOnly={Boolean(phraseResult)}
                autoFocus
              />

              <button type="submit">
                {phraseResult ? "Дальше" : "Проверить"}
              </button>
            </form>
          )}

          {phraseResult && (
            <div className={phraseResult.correct ? "result success" : "result fail"}>
              {phraseResult.correct ? (
                <p>✅ Правильно!</p>
              ) : phraseTask.type === "phrase_choice" ? (
                <p>
                  ❌ Неправильно. Правильный ответ:{" "}
                  <strong>{phraseResult.correct_answer}</strong>
                </p>
              ) : (
                <div>
                  <p>Сравни перевод:</p>
                  <p>
                    <strong>Твой вариант:</strong> {phraseAnswer}
                  </p>
                  <p>
                    <strong>Эталон:</strong> {phraseResult.correct_answer}
                  </p>
                </div>
              )}
            </div>
          )}

          {phraseResult && (
            <button className="nextButton" onClick={onNext}>
              Следующая фраза
            </button>
          )}
        </>
      ) : (
        <p className="message">Загрузка фразы...</p>
      )}
    </section>
  );
}

export default PhraseTrainer;