"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { InvestigationCard, HomePage } from "@/sanity/lib/types";
import {
  localizedSanityPath,
  sanityDataAttribute,
  type SanityPath,
} from "@/sanity/visual-editing";
import { defaultLocale, type Locale } from "@/lib/i18n";
import styles from "./InvestigationCards.module.css";

const defaultCards: InvestigationCard[] = [
  {
    id: "understanding",
    number: "01",
    category: "Understanding",
    title: "What are we really trying to understand?",
    backTitle: "How is everything actually connected?",
    backContent: "Everything is connected, but not everything is aligned. Clarity comes from seeing the true relationships.",
  },
  {
    id: "relevance",
    number: "02",
    category: "Relevance",
    title: "Why does it matter right now?",
    backTitle: "How does context change meaning?",
    backContent: "Timing shapes context. What matters today may be invisible tomorrow — unless it's captured in the right structure.",
  },
  {
    id: "connection",
    number: "03",
    category: "Connection",
    title: "How is everything actually connected?",
    backTitle: "What patterns are we missing?",
    backContent: "Systems reveal patterns that individual pieces never can. We map the invisible threads between departments, decisions, and data.",
  },
  {
    id: "action",
    number: "04",
    category: "Action",
    title: "What should we do with what we know?",
    backTitle: "How do we make it useful?",
    backContent: "Knowledge without governance decays. We define ownership, lifecycle, and reuse — turning insight into lasting infrastructure.",
  },
];

export default function InvestigationCards({
  cards: sanityCards,
  data,
  locale = defaultLocale,
}: {
  cards?: InvestigationCard[];
  data?: HomePage | null;
  locale?: Locale;
}) {
  const [openCardId, setOpenCardId] = useState<string | null>(null);

  const activeCards = sanityCards && sanityCards.length > 0 ? sanityCards : defaultCards;
  const sectionLabel = data?.perspectivesSectionLabel || "Perspectives";
  const exploreHowLabel = data?.exploreHowLabel || "Explore how";
  const closeLabel = data?.closeLabel || "Close";
  const homeId = data?._id || "homePage";
  const homeType = data?._type || "homePage";
  const homeAttr = (path: SanityPath) =>
    sanityDataAttribute({
      id: homeId,
      type: homeType,
      path: localizedSanityPath(locale, path),
    });
  const cardAttr = (card: InvestigationCard, path: SanityPath) =>
    sanityDataAttribute({
      id: card._id,
      type: card._type || "investigationCard",
      path: localizedSanityPath(locale, path),
    });
  const cardRootAttr = (card: InvestigationCard, path: SanityPath) =>
    sanityDataAttribute({
      id: card._id,
      type: card._type || "investigationCard",
      path,
    });

  const toggleCard = (id: string) => {
    setOpenCardId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="perspectives" className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionNumber}>03</span>
        <span className={styles.sectionLabel} data-sanity={homeAttr("perspectivesSectionLabel")}>
          {sectionLabel}
        </span>
      </div>

      <div className={styles.grid}>
        {activeCards.map((card, index) => {
          const cardId = card._id || card.id || card.number;
          const isOpen = openCardId === cardId;

          return (
            <motion.div layout key={cardId} className={`${styles.placeholder} ${isOpen ? styles.placeholderOpen : ""}`}>
              <motion.div
                layout
                className={`${styles.cardWrapper} ${isOpen ? styles.isOpen : ""}`}
                onClick={() => toggleCard(cardId)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  layout: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { delay: index * 0.1, duration: 0.5 },
                  y: { delay: index * 0.1, duration: 0.5 }
                }}
              >
                {/* The static back page (Right Page) */}
                <motion.div layout className={styles.bookRightPage}>
                  <p className={styles.cardBackContent} data-sanity={cardAttr(card, "backContent")}>
                    {card.backContent}
                  </p>
                  <span 
                    className={styles.cardBackCta}
                    data-sanity={homeAttr(isOpen ? "closeLabel" : "exploreHowLabel")}
                    onClick={(e) => {
                      if (isOpen) {
                        e.stopPropagation();
                        setOpenCardId(null);
                      }
                    }}
                  >
                    {isOpen ? closeLabel : exploreHowLabel}
                  </span>
                </motion.div>

                {/* The flipping cover (Left Page) */}
                <motion.div layout className={styles.bookCover}>
                  <div className={styles.bookCoverInner}>
                    {/* Front face (Cover) */}
                    <div className={styles.coverFront}>
                    <div className={styles.cardHeader}>
                      <span className={styles.cardNumber} data-sanity={cardRootAttr(card, "number")}>
                        {card.number}
                      </span>
                      <span className={styles.cardCategory} data-sanity={cardAttr(card, "category")}>
                        {card.category}
                      </span>
                    </div>
                    <h3 className={styles.cardTitle} data-sanity={cardAttr(card, "title")}>
                      {card.title}
                    </h3>
                  </div>

                  {/* Back face (Inside Left Page) */}
                  <div className={styles.coverBack}>
                    <div className={styles.coverBackHeader}>
                      <span className={styles.cardNumber} data-sanity={cardRootAttr(card, "number")}>
                        {card.number}
                      </span>
                      <span className={styles.cardCategory} data-sanity={cardAttr(card, "category")}>
                        {card.category}
                      </span>
                    </div>
                    <h3 className={styles.coverBackTitle} data-sanity={cardAttr(card, "backTitle")}>
                      {card.backTitle}
                    </h3>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Dim backdrop when any card is open */}
      <AnimatePresence>
        {openCardId && (
          <motion.div
            className={styles.pageOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenCardId(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
