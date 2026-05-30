function BlackHoleRelic({ visible }) {
  if (!visible) {
    return null;
  }

  return (
    <div className="blackHoleRelic" title="Black Hole awakened">
      <div className="blackHoleRelicCore">●</div>
      <div className="blackHoleRelicGlow" />
    </div>
  );
}

export default BlackHoleRelic;