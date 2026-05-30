import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

function SandTrapEffect({ visible, streak, onComplete }) {
  useEffect(() => {
    if (!visible) {
      return undefined;
    }

    const timerId = setTimeout(() => {
      onComplete?.();
    }, 1800);

    return () => {
      clearTimeout(timerId);
    };
  }, [visible, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="sandTrapOverlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="sandDarkness" />

          <div className="sandDust">
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

          <div className="sandVortex">
            <div className="sandRing sandRingOne" />
            <div className="sandRing sandRingTwo" />
            <div className="sandRing sandRingThree" />

            <motion.div
              className="sandCore"
              initial={{ scale: 0.2, opacity: 0 }}
              animate={{
                scale: [0.2, 1.25, 1],
                opacity: [0, 1, 1],
                rotate: [0, 14, -8, 0],
              }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={{ duration: 1.1, ease: "easeOut" }}
            >
              <div className="sandEye">◉</div>
            </motion.div>
          </div>

          <div className="sandWave sandWaveBack" />
          <div className="sandWave sandWaveMiddle" />
          <div className="sandWave sandWaveFront" />

          <motion.div
            className="sandTrapTitle"
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: [0.8, 1.12, 1],
            }}
            exit={{ opacity: 0, y: -30, scale: 0.8 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <span>SAND TRAP</span>
            <strong>STREAK x{streak}</strong>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SandTrapEffect;
