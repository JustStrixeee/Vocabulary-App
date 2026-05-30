function isRangeSelected(selectedEpisodes, start, end) {
  if (selectedEpisodes.length !== end - start + 1) {
    return false;
  }

  for (let episode = start; episode <= end; episode += 1) {
    if (!selectedEpisodes.includes(episode)) {
      return false;
    }
  }

  return true;
}

function PhraseFilters({
  selectedSeries,
  filters,
  selectedSeason,
  selectedEpisodes,
  selectedLevels,
  selectedTags,
  phraseTrainingType,
  onTrainingTypeChange,
  onSeasonChange,
  onEpisodeRangeSelect,
  onLevelToggle,
  onTagToggle,
  onSelectAllEpisodes,
  onSelectAllLevels,
  onSelectAllTags,
  onStart,
  onBack,
}) {
  if (!selectedSeries) {
    return null;
  }

  return (
    <section className="phraseScreen">
      <button className="backButton" onClick={onBack}>
        ← Назад к сериалам
      </button>

      <p className="tag">Phrase Trainer</p>

      <h2>{selectedSeries.russian_title}</h2>

      <p className="phraseMeta">{selectedSeries.description}</p>

      <div className="filterBlock">
        <h3>Тип тренировки</h3>

        <div className="chips">
          <button
            className={
              phraseTrainingType === "regular" ? "chip activeChip" : "chip"
            }
            onClick={() => onTrainingTypeChange("regular")}
          >
            Обычные фразы
          </button>

          <button
            className={
              phraseTrainingType === "matching" ? "chip activeChip" : "chip"
            }
            onClick={() => onTrainingTypeChange("matching")}
          >
            Сопоставление 4×4
          </button>
        </div>
      </div>

      <div className="filterBlock">
        <h3>Сезон</h3>

        <div className="chips">
          {filters.seasons.map((season) => (
            <button
              key={season}
              className={selectedSeason === season ? "chip activeChip" : "chip"}
              onClick={() => onSeasonChange(season)}
            >
              Сезон {season}
            </button>
          ))}
        </div>
      </div>

      <div className="filterBlock">
        <div className="filterHeader">
          <h3>Серии</h3>

          <button className="smallButton" onClick={onSelectAllEpisodes}>
            Все серии
          </button>
        </div>

        <div className="chips">
          <button
            className={
              isRangeSelected(selectedEpisodes, 1, 11)
                ? "chip activeChip"
                : "chip"
            }
            onClick={() => onEpisodeRangeSelect(1, 11)}
          >
            Серии 1–11
          </button>

          <button
            className={
              isRangeSelected(selectedEpisodes, 12, 22)
                ? "chip activeChip"
                : "chip"
            }
            onClick={() => onEpisodeRangeSelect(12, 22)}
          >
            Серии 12–22
          </button>
        </div>
      </div>

      <div className="filterBlock">
        <div className="filterHeader">
          <h3>Уровни</h3>

          <button className="smallButton" onClick={onSelectAllLevels}>
            Все уровни
          </button>
        </div>

        <div className="chips">
          {filters.levels.map((level) => (
            <button
              key={level}
              className={
                selectedLevels.includes(level) ? "chip activeChip" : "chip"
              }
              onClick={() => onLevelToggle(level)}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div className="filterBlock">
        <div className="filterHeader">
          <h3>Теги</h3>

          <button className="smallButton" onClick={onSelectAllTags}>
            Все теги
          </button>
        </div>

        <div className="chips">
          {filters.tags.map((tag) => (
            <button
              key={tag}
              className={
                selectedTags.includes(tag) ? "chip activeChip" : "chip"
              }
              onClick={() => onTagToggle(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <button className="nextButton" onClick={onStart}>
        Начать тренировку
      </button>
    </section>
  );
}

export default PhraseFilters;