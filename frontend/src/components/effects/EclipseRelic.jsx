function EclipseRelic({ visible }) {
  if (!visible) {
    return null;
  }

  return (
    <div className="eclipseRelic" title="Lunar Eclipse awakened">
      <div className="eclipseRelicCore">◐</div>
      <div className="eclipseRelicGlow" />
    </div>
  );
}

export default EclipseRelic;