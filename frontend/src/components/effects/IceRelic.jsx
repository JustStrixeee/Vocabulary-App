function IceRelic({ visible }) {
  if (!visible) {
    return null;
  }

  return (
    <div className="iceRelic" title="Ice Nova awakened">
      <div className="iceRelicCore">❄️</div>
      <div className="iceRelicGlow" />
    </div>
  );
}

export default IceRelic;