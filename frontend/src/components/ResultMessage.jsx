function ResultMessage({ result }) {
  if (!result) {
    return null;
  }

  return (
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
  );
}

export default ResultMessage;