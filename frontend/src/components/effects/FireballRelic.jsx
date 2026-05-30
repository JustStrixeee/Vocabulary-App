function FireballRelic({ visible }) {
  if (!visible) {
    return null;
  }

  return (
    <div className="fireballRelic" title="Fireball awakened">
      <div className="fireballRelicCore">🔥</div>
      <div className="fireballRelicGlow" />
    </div>
  );
}

export default FireballRelic;