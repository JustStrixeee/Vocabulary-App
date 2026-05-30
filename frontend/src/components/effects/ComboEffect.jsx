import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";

const LEGENDARY_TEST_STREAK = 2;

function getComboData(streak) {
  if (streak >= 10) {
    return {
      label: "⚡ STORM MODE",
      className: "comboOverlay stormCombo",
      nature: "storm",
    };
  }

  if (streak >= 7) {
    return {
      label: "🌪️ HURRICANE",
      className: "comboOverlay hurricaneCombo",
      nature: "hurricane",
    };
  }

  if (streak >= 5) {
    return {
      label: "⚡ LIGHTNING",
      className: "comboOverlay lightningCombo",
      nature: "lightning",
    };
  }

  return {
    label: "🌬️ GUST COMBO",
    className: "comboOverlay windCombo",
    nature: "wind",
  };
}

function runComboParticles(streak) {
  if (streak === 7) {
    confetti({
      particleCount: 70,
      spread: 90,
      startVelocity: 38,
      scalar: 0.75,
      origin: { y: 0.35 },
    });
  }

  if (streak >= LEGENDARY_TEST_STREAK) {
    confetti({
      particleCount: 130,
      spread: 120,
      startVelocity: 48,
      scalar: 0.9,
      origin: { y: 0.42 },
    });
  }
}

function WindLeaves() {
  return (
    <div className="windLeaves">
      <span>🍃</span>
      <span>🍂</span>
      <span>🍃</span>
      <span>🍂</span>
      <span>🍃</span>
      <span>🍂</span>
    </div>
  );
}

function LightningSparks() {
  return (
    <div className="lightningSparks">
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
    </div>
  );
}

function StormBolts() {
  return (
    <div className="stormBolts">
      <span className="stormBolt boltA">⚡</span>
      <span className="stormBolt boltB">⚡</span>
      <span className="stormBolt boltC">⚡</span>
      <span className="stormBolt boltD">⚡</span>
    </div>
  );
}

function LegendaryEffect({ streak }) {
  return (
    <motion.div
      className="legendaryEffect"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="legendaryBackdrop" />

      <motion.div
        className="legendaryCard"
        initial={{
          opacity: 0,
          scale: 0.35,
          rotateY: 70,
          y: 40,
        }}
        animate={{
          opacity: 1,
          scale: [0.85, 1.16, 1],
          rotateY: [70, -10, 0],
          y: 0,
        }}
        exit={{
          opacity: 0,
          scale: 0.7,
          rotateY: -35,
          y: -30,
        }}
        transition={{
          duration: 1.15,
          ease: "easeOut",
        }}
      >
        <div className="legendaryRing legendaryRingOne" />
        <div className="legendaryRing legendaryRingTwo" />

        <div className="legendaryRays">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>

        <div className="legendaryCore">⚡</div>

        <div className="legendaryTitle">LEGENDARY</div>
        <div className="legendarySubtitle">STREAK x{streak}</div>

        <div className="legendarySparks">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </motion.div>
    </motion.div>
  );
}

function ComboEffect({ streak, visible }) {
  useEffect(() => {
    if (visible && streak >= 2) {
      runComboParticles(streak);
    }
  }, [visible, streak]);

  const comboData = getComboData(streak);
  const showLegendary = streak >= LEGENDARY_TEST_STREAK;

  return (
    <AnimatePresence>
      {visible && streak >= 2 && (
        <>
          {showLegendary && <LegendaryEffect streak={streak} />}

          <motion.div
            className={comboData.className}
            initial={{
              opacity: 0,
              scale: 0.45,
              x: -140,
              y: -55,
              skewX: -14,
            }}
            animate={{
              opacity: 1,
              scale: [1, 1.22, 1.08],
              x: 0,
              y: 0,
              skewX: [0, -6, 4, 0],
            }}
            exit={{
              opacity: 0,
              scale: 0.72,
              x: 130,
              y: -35,
              skewX: 12,
            }}
            transition={{
              duration: 1.15,
              ease: "easeOut",
            }}
          >
            <div className="comboShockwave" />

            <div className="windLines">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>

            {comboData.nature === "wind" && <WindLeaves />}

            {streak >= 5 && (
              <>
                <div className="lightningBolts">
                  <span className="bolt boltOne">⚡</span>
                  <span className="bolt boltTwo">⚡</span>
                  <span className="bolt boltThree">⚡</span>
                </div>

                <LightningSparks />
              </>
            )}

            {streak >= 7 && (
              <div className="hurricaneSwirl">
                <span />
                <span />
                <span />
              </div>
            )}

            {streak >= 10 && (
              <>
                <div className="stormRing">
                  <span />
                  <span />
                  <span />
                </div>

                <StormBolts />
              </>
            )}

            <span className="comboLabel">{comboData.label}</span>
            <strong>x{streak}</strong>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default ComboEffect;