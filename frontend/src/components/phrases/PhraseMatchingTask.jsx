import { useEffect, useRef, useState } from "react";

const LINE_COLORS = ["#38bdf8", "#a855f7", "#22c55e", "#f59e0b"];

function PhraseMatchingTask({
  task,
  answers,
  result,
  error,
  onAnswerChange,
  onCheck,
  onNext,
  onBack,
}) {
  const boardRef = useRef(null);
  const leftRefs = useRef({});
  const rightRefs = useRef({});

  const [selectedLeftId, setSelectedLeftId] = useState(null);
  const [lines, setLines] = useState([]);

  function getLineColor(index) {
    return LINE_COLORS[index % LINE_COLORS.length];
  }

  function rebuildLines() {
    if (!task || !boardRef.current) {
      setLines([]);
      return;
    }

    const boardRect = boardRef.current.getBoundingClientRect();

    const nextLines = Object.entries(answers)
      .map(([leftId, rightId], index) => {
        const leftElement = leftRefs.current[leftId];
        const rightElement = rightRefs.current[rightId];

        if (!leftElement || !rightElement) {
          return null;
        }

        const leftRect = leftElement.getBoundingClientRect();
        const rightRect = rightElement.getBoundingClientRect();

        const itemResult = result?.results.find(
          (resultItem) => resultItem.phrase_id === leftId
        );

        return {
          id: `${leftId}-${rightId}`,
          x1: leftRect.right - boardRect.left,
          y1: leftRect.top + leftRect.height / 2 - boardRect.top,
          x2: rightRect.left - boardRect.left,
          y2: rightRect.top + rightRect.height / 2 - boardRect.top,
          color: result
            ? itemResult?.correct
              ? "#22c55e"
              : "#ef4444"
            : getLineColor(index),
        };
      })
      .filter(Boolean);

    setLines(nextLines);
  }

  useEffect(() => {
    rebuildLines();

    window.addEventListener("resize", rebuildLines);

    return () => {
      window.removeEventListener("resize", rebuildLines);
    };
  }, [answers, result, task]);

  if (!task) {
    return <p className="message">Загрузка сопоставления...</p>;
  }

  function handleLeftClick(itemId) {
    if (result) return;
    setSelectedLeftId(itemId);
  }

  function handleRightClick(optionId) {
    if (result || !selectedLeftId) return;

    onAnswerChange(selectedLeftId, optionId);
    setSelectedLeftId(null);
  }

  function getLeftClassName(itemId) {
    const itemResult = result?.results.find(
      (resultItem) => resultItem.phrase_id === itemId
    );

    const classes = ["lineMatchCard", "leftPhraseCard"];

    if (selectedLeftId === itemId) {
      classes.push("selectedMatchCard");
    }

    if (answers[itemId]) {
      classes.push("connectedMatchCard");
    }

    if (itemResult) {
      classes.push(itemResult.correct ? "correctMatchCard" : "wrongMatchCard");
    }

    return classes.join(" ");
  }

  function getRightClassName(optionId) {
    const isUsed = Object.values(answers).includes(optionId);
    const classes = ["lineMatchCard", "rightPhraseCard"];

    if (isUsed) {
      classes.push("connectedMatchCard");
    }

    return classes.join(" ");
  }

  return (
    <section className="phraseMatching">
      <button className="backButton" onClick={onBack}>
        ← Назад к фильтрам
      </button>

      <p className="tag">Phrase Trainer</p>

      <div className="phraseCard">
        <p className="instruction">{task.instruction}</p>
        <h3>Соедини фразы с переводом</h3>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="lineMatchingBoard" ref={boardRef}>
        <svg className="matchingSvg">
          {lines.map((line) => (
            <line
              key={line.id}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke={line.color}
              strokeWidth="4"
              strokeLinecap="round"
            />
          ))}
        </svg>

        <div className="lineMatchingColumn">
          <h4>Фразы</h4>

          {task.items.map((item) => (
            <button
              key={item.id}
              ref={(element) => {
                leftRefs.current[item.id] = element;
              }}
              className={getLeftClassName(item.id)}
              onClick={() => handleLeftClick(item.id)}
              type="button"
            >
              {item.english}
            </button>
          ))}
        </div>

        <div className="lineMatchingColumn">
          <h4>Переводы</h4>

          {task.options.map((option) => (
            <button
              key={option.id}
              ref={(element) => {
                rightRefs.current[option.id] = element;
              }}
              className={getRightClassName(option.id)}
              onClick={() => handleRightClick(option.id)}
              type="button"
            >
              {option.russian}
            </button>
          ))}
        </div>
      </div>

      {selectedLeftId && !result && (
        <p className="message">Теперь выбери перевод справа.</p>
      )}

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
          Следующее сопоставление
        </button>
      )}
    </section>
  );
}

export default PhraseMatchingTask;