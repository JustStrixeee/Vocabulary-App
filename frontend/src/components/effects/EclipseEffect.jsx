import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

function EclipseEffect({ visible, streak, onComplete }) {
  useEffect(() => {
    if (!visible) return;

    const timerId = setTimeout(() => {
      onComplete?.();
    }, 1900);

    return () => clearTimeout(timerId);
  }, [visible, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="eclipseUltimateOverlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="eclipseNight" />

          <div className="eclipseStars">
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
            <span />
            <span />
          </div>

          <motion.div
            className="eclipseScene"
            initial={{ scale: 0.55, opacity: 0, y: 20 }}
            animate={{
              scale: [0.55, 1.12, 1],
              opacity: 1,
              y: 0,
            }}
            exit={{ scale: 0.75, opacity: 0, y: -20 }}
            transition={{ duration: 1.15, ease: "easeOut" }}
          >
            <div className="eclipseCorona" />
            <div className="moonDisc" />
            <div className="shadowDisc" />
            <div className="bloodRing" />
          </motion.div>

          <div className="eclipseDust">
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
            className="eclipseUltimateTitle"
            initial={{ opacity: 0, y: 52, scale: 0.76 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: [0.76, 1.1, 1],
            }}
            exit={{ opacity: 0, y: -28, scale: 0.8 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.25 }}
          >
            <span>LUNAR ECLIPSE</span>
            <strong>STREAK x{streak}</strong>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default EclipseEffect;