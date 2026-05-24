function AnswerForm({
  task,
  answer,
  setAnswer,
  result,
  onCheckAnswer,
}) {
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
    <div className="answerBox">
      <input
        value={answer}
        onChange={(event) => setAnswer(event.target.value)}
        placeholder="Введите перевод"
        disabled={Boolean(result)}
      />

      <button onClick={() => onCheckAnswer()} disabled={Boolean(result)}>
        Проверить
      </button>
    </div>
  );
}

export default AnswerForm;