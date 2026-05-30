import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const MATRIX_COLUMNS = Array.from({ length: 28 }, (_, index) => index);
const MATRIX_BITS = Array.from({ length: 46 }, (_, index) => index);

function MatrixEffect({ visible, streak, onComplete }) {
  useEffect(() => {
    if (!visible) return;

    const timerId = setTimeout(() => {
      onComplete?.();
    }, 2100);

    return () => clearTimeout(timerId);
  }, [visible, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="matrixUltimateOverlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          <div className="matrixDarkness" />

          <div className="matrixRain">
            {MATRIX_COLUMNS.map((column) => (
              <div
                className="matrixColumn"
                key={column}
                style={{
                  left: `${(column / MATRIX_COLUMNS.length) * 100}%`,
                  animationDelay: `${(column % 7) * 0.09}s`,
                }}
              >
                {MATRIX_BITS.map((bit) => (
                  <span key={bit}>{(column + bit) % 2}</span>
                ))}
              </div>
            ))}
          </div>

          <div className="matrixCenterBreak">
            <div className="matrixCore">01</div>
            <div className="matrixBreakRing ringA" />
            <div className="matrixBreakRing ringB" />
            <div className="matrixBreakRing ringC" />
          </div>

          <div className="matrixShards">
            <span>1</span>
            <span>0</span>
            <span>1</span>
            <span>0</span>
            <span>1</span>
            <span>0</span>
            <span>1</span>
            <span>0</span>
          </div>

          <motion.div
            className="matrixUltimateTitle"
            initial={{ opacity: 0, y: 52, scale: 0.76 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: [0.76, 1.1, 1],
            }}
            exit={{ opacity: 0, y: -28, scale: 0.8 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.25 }}
          >
            <span>MATRIX BREACH</span>
            <strong>STREAK x{streak}</strong>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default MatrixEffect;