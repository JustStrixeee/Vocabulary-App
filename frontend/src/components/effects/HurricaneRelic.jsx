function HurricaneRelic({ visible }) {
  if (!visible) {
    return null;
  }

  return (
    <div className="hurricaneRelic" title="Hurricane awakened">
      <div className="hurricaneRelicCore">🌪️</div>
      <div className="hurricaneRelicGlow" />
    </div>
  );
}

export default HurricaneRelic;