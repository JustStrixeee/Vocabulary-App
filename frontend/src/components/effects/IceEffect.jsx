import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

function IceEffect({ visible, streak, onComplete }) {
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
          className="iceUltimateOverlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="iceFlash" />
          <div className="iceFrostFrame" />

          <div className="iceCracks">
            <span className="iceCrack crackOne" />
            <span className="iceCrack crackTwo" />
            <span className="iceCrack crackThree" />
            <span className="iceCrack crackFour" />
            <span className="iceCrack crackFive" />
            <span className="iceCrack crackSix" />
          </div>

          <div className="iceSnow">
            <span>❄️</span>
            <span>✦</span>
            <span>❄️</span>
            <span>✧</span>
            <span>❄️</span>
            <span>✦</span>
            <span>❄️</span>
            <span>✧</span>
            <span>❄️</span>
            <span>✦</span>
          </div>

          <motion.div
            className="iceCore"
            initial={{
              opacity: 0,
              scale: 0.25,
              rotate: -20,
            }}
            animate={{
              opacity: 1,
              scale: [0.25, 1.35, 1],
              rotate: [-20, 10, 0],
            }}
            exit={{
              opacity: 0,
              scale: 0.5,
              rotate: 20,
            }}
            transition={{
              duration: 1.05,
              ease: "easeOut",
            }}
          >
            ❄️
          </motion.div>

          <motion.div
            className="iceUltimateTitle"
            initial={{ opacity: 0, y: 48, scale: 0.72 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: [0.72, 1.13, 1],
            }}
            exit={{ opacity: 0, y: -28, scale: 0.78 }}
            transition={{ duration: 0.95, ease: "easeOut" }}
          >
            <span>ICE NOVA</span>
            <strong>STREAK x{streak}</strong>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default IceEffect;