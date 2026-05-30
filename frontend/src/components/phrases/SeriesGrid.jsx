function SeriesGrid({ seriesList, onSelectSeries }) {
  if (seriesList.length === 0) {
    return <p className="message">Сериалы пока не найдены.</p>;
  }

  return (
    <section className="seriesSection phraseScreen">
      <p className="tag">Phrase Trainer</p>

      <h2>Выбери сериал</h2>

      <div className="seriesGrid">
        {seriesList.map((series) => (
          <div
            className="seriesCard"
            key={series.id}
            role="button"
            tabIndex={0}
            onClick={() => onSelectSeries(series)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                onSelectSeries(series);
              }
            }}
          >
            <div className="seriesPoster">
              <img
                src={`/series-posters/${series.poster}`}
                alt={series.title}
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            </div>

            <div className="seriesInfo">
              <h3>{series.russian_title}</h3>
              <p>{series.title}</p>
              <span>{series.description}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default SeriesGrid;