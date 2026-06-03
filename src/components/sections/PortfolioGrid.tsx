"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { stegaClean } from "next-sanity";
import { cases as defaultCases } from "@/lib/cases";
import { defaultLocale, type Locale, withLocalePath } from "@/lib/i18n";
import type { PortfolioCase, HomePage } from "@/sanity/lib/types";
import styles from "./PortfolioGrid.module.css";

export default function PortfolioGrid({
  caseSlugs,
  cases,
  data,
  locale = defaultLocale,
  isCompact = false,
}: {
  caseSlugs?: string[];
  cases?: PortfolioCase[];
  data?: HomePage | null;
  locale?: Locale;
  isCompact?: boolean;
}) {
  const allCases = cases && cases.length > 0 ? cases : defaultCases;
  const sectionLabel = data?.portfolioSectionLabel || "Case Studies";
  const industryLabel = data?.industryLabel || "Industry";
  const yearLabel = data?.yearLabel || "Year";
  const focusLabel = data?.focusLabel || "Focus";
  const viewCaseLabel = data?.viewCaseLabel || "View Case →";
  const cleanCaseSlugs = caseSlugs?.map((slug) => stegaClean(slug));
  const displayCases = cleanCaseSlugs
    ? allCases.filter((c) => cleanCaseSlugs.includes(stegaClean(c.slug)))
    : allCases;

  const content = (
    <ul className={styles.list}>
      {displayCases.map((item, index) => {
        const slug = stegaClean(item.slug);

        return (
          <motion.li
            key={slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Link href={withLocalePath(locale, `/case/${slug}`)} className={`${styles.row} ${isCompact ? styles.compactRow : ""}`}>
              <h3 className={styles.rowTitle}>{item.title}</h3>

              <div className={styles.rowMeta}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>{industryLabel}</span>
                  <span className={styles.metaValue}>{item.industry}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>{yearLabel}</span>
                  <span className={styles.metaValue}>{item.year}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>{focusLabel}</span>
                  <span className={styles.metaValue}>{item.focus}</span>
                </div>
                <span className={styles.viewCase}>{viewCaseLabel}</span>
              </div>
            </Link>
          </motion.li>
        )
      })}
    </ul>
  );

  if (isCompact) {
    return <div className={styles.compactContainer}>{content}</div>;
  }

  return (
    <section id="portfolio" className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionNumber}>04</span>
        <span className={styles.sectionLabel}>{sectionLabel}</span>
      </div>
      {content}
    </section>
  );
}
