function MatrixRelic({ visible }) {
  if (!visible) {
    return null;
  }

  return (
    <div className="matrixRelic" title="Matrix Breach awakened">
      <div className="matrixRelicCore">01</div>
      <div className="matrixRelicGlow" />
    </div>
  );
}

export default MatrixRelic;