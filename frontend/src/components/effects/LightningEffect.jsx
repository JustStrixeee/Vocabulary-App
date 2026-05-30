import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

function LightningEffect({ visible, streak, onComplete }) {
  useEffect(() => {
    if (!visible) return;

    const timerId = setTimeout(() => {
      onComplete?.();
    }, 1600);

    return () => clearTimeout(timerId);
  }, [visible, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="lightningUltimateOverlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <div className="lightningFlash" />

          <div className="lightningSky">
            <span className="ultimateBolt boltLeft">⚡</span>
            <span className="ultimateBolt boltCenter">⚡</span>
            <span className="ultimateBolt boltRight">⚡</span>
          </div>

          <div className="lightningCracks">
            <span />
            <span />
            <span />
            <span />
          </div>

          <div className="ultimateSparks">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>

          <motion.div
            className="lightningUltimateTitle"
            initial={{ opacity: 0, scale: 0.55, y: 35 }}
            animate={{
              opacity: 1,
              scale: [0.75, 1.18, 1],
              y: 0,
            }}
            exit={{ opacity: 0, scale: 0.7, y: -24 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <span>LIGHTNING STRIKE</span>
            <strong>STREAK x{streak}</strong>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default LightningEffect;