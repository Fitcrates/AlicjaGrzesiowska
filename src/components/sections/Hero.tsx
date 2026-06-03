"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { HomePage } from "@/sanity/lib/types";
import styles from "./Hero.module.css";

function Typewriter({
  text,
  onComplete,
  italic = false,
  showCursor = true,
}: {
  text: string;
  onComplete?: () => void;
  italic?: boolean;
  showCursor?: boolean;
}) {
  const [displayText, setDisplayText] = useState("");
  const onCompleteRef = useRef(onComplete);

  // Keep ref up to date
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let charIndex = 0;

    const typeNextChar = () => {
      if (charIndex < text.length) {
        setDisplayText(text.slice(0, charIndex + 1));
        charIndex++;
        // Typewriter delay: random between 40ms and 80ms
        timeoutId = setTimeout(typeNextChar, Math.random() * 40 + 40);
      } else {
        if (onCompleteRef.current) onCompleteRef.current();
      }
    };

    timeoutId = setTimeout(typeNextChar, 100);
    return () => clearTimeout(timeoutId);
  }, [text]);

  return (
    <span className={italic ? styles.headingItalic : ""}>
      {displayText}
      {showCursor && (
        <motion.span
          animate={{ opacity: [1, 1, 0, 0] }}
          transition={{ repeat: Infinity, duration: 1, times: [0, 0.5, 0.5, 1] }}
          style={{
            display: "inline-block",
            width: "0.02em",
            height: "0.9em",
            backgroundColor: "var(--color-primary)",
            marginLeft: "0.05em",
            verticalAlign: "baseline",
            position: "relative",
            top: "0.05em"
          }}
        />
      )}
    </span>
  );
}

export default function Hero({ data }: { data?: HomePage | null }) {
  const [phase, setPhase] = useState(0);

  const topText = data?.heroTopText || "No organization has a solely content problem.\nIt has an information problem.";
  const words = data?.heroWords || [
    "companies",
    "organizations",
    "explain stuff better",
    "remember and define ",
    "what they ",
    "know."
  ];
  const heroPrefix = data?.heroPrefix || "I help ";
  const heroScrollLabel = data?.heroScrollLabel || "Scroll to explore ↓";

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (phase === 0) {
      // Wait before crossing out "companies"
      timeoutId = setTimeout(() => setPhase(1), 1500);
    } else if (phase === 1) {
      // Wait for strikethrough animation, then start typing "organizations"
      timeoutId = setTimeout(() => setPhase(2), 600);
    } else if (phase === 3) {
      // "organizations" typed. Pause briefly before crossing out "explain stuff better"
      timeoutId = setTimeout(() => setPhase(4), 500);
    } else if (phase === 4) {
      // Wait for strikethrough animation, then start typing "remember and define"
      timeoutId = setTimeout(() => setPhase(5), 600);
    }

    return () => clearTimeout(timeoutId);
  }, [phase]);

  return (
    <section className={styles.hero}>
      {/* Main Heading */}
      <div className={styles.heroContent}>
        <div className={styles.heroProblemContainer}>
          <motion.p
            className={styles.heroProblemText}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {topText.split('\n').map((line: string, i: number) => (
              <span key={i}>
                {line}
                {i < topText.split('\n').length - 1 && <br />}
              </span>
            ))}
          </motion.p>
        </div>

        <motion.div className={styles.headingWrapper} layout>
          {/* First Line */}
          <motion.div className={styles.headingLine} layout>
            <motion.span layout style={{ display: "inline-block", marginRight: "0.2em" }}>{heroPrefix}</motion.span>
            <AnimatePresence mode="popLayout">
              {phase < 2 ? (
                <motion.span
                  key={words[0]}
                  className={styles.draftWord}
                  layout
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  {words[0]}
                  {phase >= 1 && (
                    <motion.span
                      className={styles.strikethrough}
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                  )}
                </motion.span>
              ) : (
                <motion.span
                  key={words[1]}
                  className={styles.finalWord}
                  layout
                >
                  <Typewriter
                    text={words[1]}
                    onComplete={() => setPhase(3)}
                    showCursor={phase === 2}
                  />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Second Line */}
          <AnimatePresence mode="popLayout">
            {phase < 5 ? (
              <motion.div
                key={words[2]}
                className={styles.headingLine}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                layout
              >
                <motion.span className={styles.draftWord} layout>
                  {words[2]}
                  {phase >= 4 && (
                    <motion.span
                      className={styles.strikethrough}
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                  )}
                </motion.span>
              </motion.div>
            ) : (
              <motion.div key={words[3]} className={styles.headingLine} layout>
                {phase >= 5 && (
                  <Typewriter
                    text={words[3]}
                    onComplete={() => setPhase(6)}
                    showCursor={phase === 5}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Third Line */}
          <AnimatePresence>
            {phase >= 6 && (
              <motion.div
                key="what-they-know"
                className={styles.headingLine}
                layout
              >
                <Typewriter
                  text={words[4]}
                  onComplete={() => setPhase(7)}
                  showCursor={phase === 6}
                />
                {phase >= 7 && (
                  <Typewriter
                    text={words[5]}
                    italic
                    onComplete={() => setPhase(8)}
                    showCursor={phase >= 7}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Bottom bar */}
      <motion.div
        className={styles.heroBottom}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <span className={styles.scrollIndicator}>{heroScrollLabel}</span>
      </motion.div>
    </section>
  );
}
