function SandRelic({ visible }) {
  if (!visible) {
    return null;
  }

  return (
    <div className="sandRelic" title="Sand Trap awakened">
      <div className="sandRelicCore">◉</div>
      <div className="sandRelicGlow" />
    </div>
  );
}

export default SandRelic;