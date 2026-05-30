import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

function BlackHoleEffect({ visible, streak, onComplete }) {
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
          className="blackHoleUltimateOverlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="blackHoleSpace" />

          <div className="blackHoleStars">
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
            className="blackHoleScene"
            initial={{ opacity: 0, scale: 0.35, rotate: -18 }}
            animate={{
              opacity: 1,
              scale: [0.35, 1.18, 1],
              rotate: [-18, 12, 0],
            }}
            exit={{ opacity: 0, scale: 0.65, rotate: 20 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <div className="blackHoleAccretion accretionOne" />
            <div className="blackHoleAccretion accretionTwo" />
            <div className="blackHoleAccretion accretionThree" />
            <div className="blackHoleCore" />
            <div className="blackHoleGlow" />
          </motion.div>

          <div className="blackHoleParticles">
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

          <div className="blackHoleDistortion">
            <span />
            <span />
          </div>

          <motion.div
            className="blackHoleUltimateTitle"
            initial={{ opacity: 0, y: 54, scale: 0.76 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: [0.76, 1.12, 1],
            }}
            exit={{ opacity: 0, y: -30, scale: 0.8 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.25 }}
          >
            <span>BLACK HOLE</span>
            <strong>STREAK x{streak}</strong>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default BlackHoleEffect;