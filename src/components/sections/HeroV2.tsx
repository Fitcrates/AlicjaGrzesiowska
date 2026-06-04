"use client";

import { useState, useEffect, useRef, type CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bold, Italic, Underline, Strikethrough, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Moon, Sun
} from "lucide-react";
import type { HomePage } from "@/sanity/lib/types";
import styles from "./HeroV2.module.css";

type TextAlign = NonNullable<CSSProperties["textAlign"]>;
type EditorFormat = {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
  align: TextAlign;
  list: "none" | "ul" | "ol";
};

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
            backgroundColor: "currentColor",
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

export default function HeroV2({ data }: { data?: HomePage | null }) {
  const [phase, setPhase] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Text formatting state
  const [format, setFormat] = useState<EditorFormat>({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    align: 'left',
    list: 'none'
  });

  const topText = data?.heroTopText || "No organization has a solely content problem.\nIt has an information problem.";
  const words = data?.heroWords || [
    "companies",
    "organizations",
    "explain stuff better",
    "remember and define",
    "what they",
    "know."
  ];
  const heroPrefix = data?.heroPrefix || "I help";
  const heroScrollLabel = data?.heroScrollLabel || "Scroll to explore ↓";

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (phase === 0) {
      timeoutId = setTimeout(() => setPhase(1), 1500);
    } else if (phase === 1) {
      timeoutId = setTimeout(() => setPhase(2), 600);
    } else if (phase === 3) {
      timeoutId = setTimeout(() => setPhase(4), 500);
    } else if (phase === 4) {
      timeoutId = setTimeout(() => setPhase(5), 600);
    }

    return () => clearTimeout(timeoutId);
  }, [phase]);

  const toggleFormat = (key: 'bold' | 'italic' | 'underline' | 'strikethrough') => {
    setFormat(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const setAlign = (align: TextAlign) => {
    setFormat(prev => ({ ...prev, align }));
  };

  const toggleList = (listType: 'ul' | 'ol') => {
    setFormat(prev => ({
      ...prev,
      list: prev.list === listType ? 'none' : listType
    }));
  };

  const getJustifyContent = () => {
    switch (format.align) {
      case 'center': return 'center';
      case 'right': return 'flex-end';
      case 'justify': return 'space-between';
      default: return 'flex-start';
    }
  };

  // Dynamic styles applied to the text content
  const dynamicTextStyle = {
    fontWeight: format.bold ? 'bold' : 'normal',
    fontStyle: format.italic ? 'italic' : 'normal',
    textDecoration: [
      format.underline ? 'underline' : '',
      format.strikethrough ? 'line-through' : ''
    ].filter(Boolean).join(' ') || 'none',
  };

  const renderListMarker = (index: number) => {
    if (format.list === 'none') return null;
    return (
      <span className={styles.listMarker}>
        {format.list === 'ul' ? '•' : `${index + 1}.`}
      </span>
    );
  };

  return (
    <section className={styles.hero}>
      <div className={`${styles.editorWindow} ${isDarkMode ? styles.dark : ""}`}>
        {/* Title Bar */}
        <div className={styles.titleBar}>
          <div className={styles.windowControls}>
            <div className={`${styles.controlDot} ${styles.dotRed}`} />
            <div className={`${styles.controlDot} ${styles.dotYellow}`} />
            <div className={`${styles.controlDot} ${styles.dotGreen}`} />
          </div>
          <div className={styles.fileName}>Organization_defined.docx</div>
        </div>

        {/* Toolbar */}
        <div className={styles.toolBar}>
          <div className={styles.toolGroupContainer}>
            <div className={styles.toolGroup}>
              <button
                className={`${styles.toolButton} ${format.bold ? styles.toolButtonActive : ''}`}
                onClick={() => toggleFormat('bold')}
              ><Bold size={16} /></button>
              <button
                className={`${styles.toolButton} ${format.italic ? styles.toolButtonActive : ''}`}
                onClick={() => toggleFormat('italic')}
              ><Italic size={16} /></button>
              <button
                className={`${styles.toolButton} ${format.underline ? styles.toolButtonActive : ''}`}
                onClick={() => toggleFormat('underline')}
              ><Underline size={16} /></button>
              <button
                className={`${styles.toolButton} ${format.strikethrough ? styles.toolButtonActive : ''}`}
                onClick={() => toggleFormat('strikethrough')}
              ><Strikethrough size={16} /></button>
            </div>
            <div className={styles.toolGroup}>
              <button
                className={`${styles.toolButton} ${format.align === 'left' ? styles.toolButtonActive : ''}`}
                onClick={() => setAlign('left')}
              ><AlignLeft size={16} /></button>
              <button
                className={`${styles.toolButton} ${format.align === 'center' ? styles.toolButtonActive : ''}`}
                onClick={() => setAlign('center')}
              ><AlignCenter size={16} /></button>
              <button
                className={`${styles.toolButton} ${format.align === 'right' ? styles.toolButtonActive : ''}`}
                onClick={() => setAlign('right')}
              ><AlignRight size={16} /></button>
              <button
                className={`${styles.toolButton} ${format.align === 'justify' ? styles.toolButtonActive : ''}`}
                onClick={() => setAlign('justify')}
              ><AlignJustify size={16} /></button>
            </div>
            <div className={styles.toolGroup}>
              <button 
                className={`${styles.toolButton} ${format.list === 'ul' ? styles.toolButtonActive : ''}`}
                onClick={() => toggleList('ul')}
              ><List size={16} /></button>
              <button 
                className={`${styles.toolButton} ${format.list === 'ol' ? styles.toolButtonActive : ''}`}
                onClick={() => toggleList('ol')}
              ><ListOrdered size={16} /></button>
            </div>
          </div>

          <button
            className={`${styles.toolButton} ${styles.themeToggleBtn}`}
            onClick={() => setIsDarkMode(!isDarkMode)}
            title="Toggle theme"
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        {/* Editor Content Area */}
        <div className={styles.editorContent}>
          <div className={styles.heroProblemContainer} style={{ textAlign: format.align }}>
            <motion.p
              className={styles.heroProblemText}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              style={{
                ...dynamicTextStyle,
                margin: format.align === 'center' ? '0 auto' : format.align === 'right' ? '0 0 0 auto' : '0 auto 0 0',
              }}
            >
              {topText.split('\n').map((line: string, i: number) => (
                <span key={i}>
                  {line}
                  {i < topText.split('\n').length - 1 && <br />}
                </span>
              ))}
            </motion.p>
          </div>

          <motion.div
            className={styles.headingWrapper}
            layout
            style={{
              alignItems: format.align === 'center' ? 'center' : format.align === 'right' ? 'flex-end' : 'flex-start',
            }}
          >
            {/* First Line */}
            <motion.div
              className={styles.headingLine}
              layout
              style={{ ...dynamicTextStyle, justifyContent: getJustifyContent() }}
            >
              {renderListMarker(0)}
              <motion.span layout style={{ marginRight: "0.2em" }}>{heroPrefix}</motion.span>
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
                        className={styles.strikethroughAnim}
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
                  style={{ ...dynamicTextStyle, justifyContent: getJustifyContent() }}
                >
                  {renderListMarker(1)}
                  <motion.span className={styles.draftWord} layout>
                    {words[2]}
                    {phase >= 4 && (
                      <motion.span
                        className={styles.strikethroughAnim}
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      />
                    )}
                  </motion.span>
                </motion.div>
              ) : (
                <motion.div
                  key={words[3]}
                  className={styles.headingLine}
                  layout
                  style={{ ...dynamicTextStyle, justifyContent: getJustifyContent() }}
                >
                  {renderListMarker(1)}
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
                  style={{ ...dynamicTextStyle, justifyContent: getJustifyContent() }}
                >
                  {renderListMarker(2)}
                  <Typewriter
                    text={words[4] + " "}
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

        {/* Status Bar */}
        <div className={styles.statusBar}>
          <span>Page 1 of 1</span>
          <span>English (US)</span>
        </div>
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
