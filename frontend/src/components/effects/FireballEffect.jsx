import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

function FireballEffect({ visible, streak, onComplete }) {
  useEffect(() => {
    if (!visible) return;

    const timerId = setTimeout(() => {
      onComplete?.();
    }, 1700);

    return () => clearTimeout(timerId);
  }, [visible, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fireballUltimateOverlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <div className="fireballDarkness" />
          <div className="fireballImpactFlash" />

          <motion.div
            className="fireballProjectile"
            initial={{
              x: "-58vw",
              y: "-12vh",
              scale: 0.6,
              rotate: -18,
              opacity: 0,
            }}
            animate={{
              x: ["-58vw", "-18vw", "0vw"],
              y: ["-12vh", "2vh", "0vh"],
              scale: [0.6, 1.15, 1.35],
              rotate: [-18, 8, 0],
              opacity: [0, 1, 1],
            }}
            exit={{
              opacity: 0,
              scale: 0.4,
            }}
            transition={{
              duration: 0.9,
              ease: "easeOut",
            }}
          >
            <div className="fireballTail">
              <span />
              <span />
              <span />
              <span />
            </div>

            <div className="fireballCore">🔥</div>
          </motion.div>

          <div className="fireballExplosion">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>

          <div className="fireballShockwave">
            <span />
            <span />
          </div>

          <div className="fireballEmbers">
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
            className="fireballUltimateTitle"
            initial={{ opacity: 0, y: 52, scale: 0.74 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: [0.74, 1.14, 1],
            }}
            exit={{ opacity: 0, y: -28, scale: 0.78 }}
            transition={{ duration: 0.95, ease: "easeOut", delay: 0.25 }}
          >
            <span>FIREBALL</span>
            <strong>STREAK x{streak}</strong>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default FireballEffect;