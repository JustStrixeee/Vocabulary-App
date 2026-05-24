function AnswerForm({
  task,
  answer,
  setAnswer,
  result,
  onCheckAnswer,
  onNext,
}) {
  function handleSubmit(event) {
    event.preventDefault();

    if (result) {
      onNext();
      return;
    }

    onCheckAnswer();
  }

  if (task.type === "choice") {
    return (
      <div className="options">
        {task.options.map((option) => (
          <button
            key={option}
            className="optionButton"
            onClick={() => onCheckAnswer(option)}
            disabled={Boolean(result)}
          >
            {option}
          </button>
        ))}
      </div>
    );
  }

  return (
    <form className="answerBox" onSubmit={handleSubmit}>
      <input
        value={answer}
        onChange={(event) => setAnswer(event.target.value)}
        placeholder="Введите перевод"
        readOnly={Boolean(result)}
        autoFocus
      />

      <button type="submit">
        {result ? "Дальше" : "Проверить"}
      </button>
    </form>
  );
}

export default AnswerForm;