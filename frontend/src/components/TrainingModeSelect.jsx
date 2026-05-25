function TrainingModeSelect({ trainingMode, onChange }) {
  return (
    <label className="modeSelect">
      <span>Режим тренировки</span>

      <select
        value={trainingMode}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="translation">Перевод</option>
        <option value="matching">Сопоставление</option>
      </select>
    </label>
  );
}

export default TrainingModeSelect;