import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

function HurricaneEffect({ visible, streak, onComplete }) {
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
          className="hurricaneUltimateOverlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          <div className="hurricaneSky" />

          <div className="hurricaneWindLines">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>

          <motion.div
            className="hurricaneVortex"
            initial={{ scale: 0.45, opacity: 0, rotate: -25 }}
            animate={{
              scale: [0.45, 1.16, 1],
              opacity: 1,
              rotate: [-25, 18, 0],
            }}
            exit={{ scale: 0.65, opacity: 0, rotate: 25 }}
            transition={{ duration: 1.15, ease: "easeOut" }}
          >
            <div className="hurricaneRing ringOne" />
            <div className="hurricaneRing ringTwo" />
            <div className="hurricaneRing ringThree" />
            <div className="hurricaneRing ringFour" />
            <div className="hurricaneEye">◉</div>
          </motion.div>

          <div className="hurricaneDebris">
            <span>🍃</span>
            <span>🍂</span>
            <span>✦</span>
            <span>🍃</span>
            <span>✧</span>
            <span>🍂</span>
            <span>🍃</span>
            <span>✦</span>
            <span>🍂</span>
            <span>✧</span>
            <span>🍃</span>
            <span>🍂</span>
          </div>

          <div className="hurricaneShockwave">
            <span />
            <span />
          </div>

          <motion.div
            className="hurricaneUltimateTitle"
            initial={{ opacity: 0, y: 52, scale: 0.76 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: [0.76, 1.1, 1],
            }}
            exit={{ opacity: 0, y: -28, scale: 0.8 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.22 }}
          >
            <span>HURRICANE</span>
            <strong>STREAK x{streak}</strong>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default HurricaneEffect;