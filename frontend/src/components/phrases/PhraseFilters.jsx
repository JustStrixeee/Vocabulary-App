function PhraseFilters({
  selectedSeries,
  filters,
  selectedSeason,
  selectedEpisodes,
  selectedLevels,
  selectedTags,
  onSeasonChange,
  onEpisodeToggle,
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
          {filters.episodes
            .filter((episode) => episode.season === selectedSeason)
            .map((episode) => (
              <button
                key={`${episode.season}-${episode.episode}`}
                className={
                  selectedEpisodes.includes(episode.episode)
                    ? "chip activeChip"
                    : "chip"
                }
                onClick={() => onEpisodeToggle(episode.episode)}
              >
                {episode.episode_code}
              </button>
            ))}
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
              className={selectedLevels.includes(level) ? "chip activeChip" : "chip"}
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
              className={selectedTags.includes(tag) ? "chip activeChip" : "chip"}
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