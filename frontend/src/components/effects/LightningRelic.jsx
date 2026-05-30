function LightningRelic({ visible }) {
  if (!visible) {
    return null;
  }

  return (
    <div className="lightningRelic" title="Lightning Strike awakened">
      <div className="lightningRelicCore">⚡</div>
      <div className="lightningRelicGlow" />
    </div>
  );
}

export default LightningRelic;