"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { stegaClean } from "next-sanity";
import type { CaseStudy } from "@/lib/cases";
import { defaultLocale, type Locale, withLocalePath } from "@/lib/i18n";
import type { HomePage } from "@/sanity/lib/types";
import {
  keyedPath,
  localizedSanityPath,
  sanityDataAttribute,
  type SanityPath,
} from "@/sanity/visual-editing";
import styles from "./CaseStudyContent.module.css";

export default function CaseStudyContent({
  study,
  data,
  locale = defaultLocale,
}: {
  study: CaseStudy;
  data?: HomePage | null;
  locale?: Locale;
}) {
  const nextCaseSlug = study.nextCase ? stegaClean(study.nextCase) : null;
  const homeId = data?._id || "homePage";
  const homeType = data?._type || "homePage";
  const homeAttr = (path: SanityPath) =>
    sanityDataAttribute({
      id: homeId,
      type: homeType,
      path: localizedSanityPath(locale, path),
    });
  const caseAttr = (path: SanityPath) =>
    sanityDataAttribute({
      id: study._id,
      type: study._type || "caseStudy",
      path: localizedSanityPath(locale, path),
    });
  const caseRootAttr = (path: SanityPath) =>
    sanityDataAttribute({
      id: study._id,
      type: study._type || "caseStudy",
      path,
    });

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <>
      <article className={styles.article}>
        {/* Navigation / Back */}
        <div className={styles.navTop}>
          <Link href={withLocalePath(locale, "/#portfolio")} className={styles.backLink}>
            <span className={styles.arrow}>←</span>{" "}
            <span data-sanity={homeAttr("backToIndexLabel")}>
              {data?.backToIndexLabel || "Back to index"}
            </span>
          </Link>
        </div>

        {/* Hero Section */}
        <header className={styles.hero}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className={styles.heroContent}
          >
            <motion.h1 variants={fadeUp} className={styles.title} data-sanity={caseAttr("title")}>
              {study.title}
            </motion.h1>
            
            <motion.div variants={fadeUp} className={styles.metaContainer}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel} data-sanity={homeAttr("industryLabel")}>
                  {data?.industryLabel || "Industry"}
                </span>
                <span className={styles.metaValue} data-sanity={caseAttr("industry")}>
                  {study.industry}
                </span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel} data-sanity={homeAttr("yearLabel")}>
                  {data?.yearLabel || "Year"}
                </span>
                <span className={styles.metaValue} data-sanity={caseRootAttr("year")}>
                  {study.year}
                </span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel} data-sanity={homeAttr("focusLabel")}>
                  {data?.focusLabel || "Focus"}
                </span>
                <span className={styles.metaValue} data-sanity={caseAttr("focus")}>
                  {study.focus}
                </span>
              </div>
            </motion.div>

            <motion.p variants={fadeUp} className={styles.heroQuote} data-sanity={caseAttr("heroQuote")}>
              &ldquo;{study.heroQuote}&rdquo;
            </motion.p>
          </motion.div>
        </header>

        {/* Challenge & Approach */}
        <section className={styles.twoColSection}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className={styles.col}
          >
            <h2 className={styles.sectionTitle} data-sanity={homeAttr("challengeSectionTitle")}>
              {data?.challengeSectionTitle || "The Challenge"}
            </h2>
            <p className={styles.bodyText} data-sanity={caseAttr("challenge")}>
              {study.challenge}
            </p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className={styles.col}
          >
            <h2 className={styles.sectionTitle} data-sanity={homeAttr("approachSectionTitle")}>
              {data?.approachSectionTitle || "The Approach"}
            </h2>
            <p className={styles.bodyText} data-sanity={caseAttr("approach")}>
              {study.approach}
            </p>
          </motion.div>
        </section>

        {/* Process Section */}
        <section className={styles.processSection}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className={styles.sectionHeader}
          >
            <h2 className={styles.sectionTitle} data-sanity={homeAttr("processSectionTitle")}>
              {data?.processSectionTitle || "The Process"}
            </h2>
          </motion.div>
          
          <div className={styles.processGrid}>
            {study.process.map((step: { _key?: string; number: string; title: string; description: string }, index: number) => (
              <motion.div
                key={step.number}
                className={styles.processStep}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className={styles.stepHeader}>
                  <span
                    className={styles.stepNumber}
                    data-sanity={caseAttr(["process", ...keyedPath(step._key, index), "number"])}
                  >
                    {step.number}
                  </span>
                  <h3
                    className={styles.stepTitle}
                    data-sanity={caseAttr(["process", ...keyedPath(step._key, index), "title"])}
                  >
                    {step.title}
                  </h3>
                </div>
                <p
                  className={styles.stepDescription}
                  data-sanity={caseAttr(["process", ...keyedPath(step._key, index), "description"])}
                >
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Optional Gallery Section */}
        {(study.galleryUrls && study.galleryUrls.length > 0) && (
          <section className={styles.gallerySection}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
              className={styles.sectionHeader}
            >
              <h2 className={styles.sectionTitle} data-sanity={homeAttr("gallerySectionTitle")}>
                {data?.gallerySectionTitle || "Gallery"}
              </h2>
            </motion.div>

            <div className={styles.galleryGrid}>
              {study.galleryUrls.map((imageSrc: string, index: number) => (
                <motion.div
                  key={index}
                  className={styles.galleryImageWrapper}
                  data-sanity={caseRootAttr(["galleryUrls", index])}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Image
                    src={imageSrc}
                    alt={`${study.title} gallery image ${index + 1}`}
                    width={800}
                    height={600}
                    className={styles.galleryImage}
                  />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Deliverables & Results */}
        <section className={styles.bottomSection}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className={styles.deliverablesCol}
          >
            <h2 className={styles.sectionTitle} data-sanity={homeAttr("deliverablesSectionTitle")}>
              {data?.deliverablesSectionTitle || "Deliverables"}
            </h2>
            <ul className={styles.deliverablesList}>
              {study.deliverables.map((item: string, i: number) => (
                <li key={i} className={styles.deliverableItem} data-sanity={caseAttr(["deliverables", i])}>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className={styles.resultsCol}
          >
            <h2 className={styles.sectionTitle} data-sanity={homeAttr("impactSectionTitle")}>
              {data?.impactSectionTitle || "The Impact"}
            </h2>
            <p className={styles.resultsText} data-sanity={caseAttr("results")}>
              {study.results}
            </p>
          </motion.div>
        </section>

        {/* Next Case Footer */}
        {nextCaseSlug && (
          <footer className={styles.nextCaseFooter}>
            <Link href={withLocalePath(locale, `/case/${nextCaseSlug}`)} className={styles.nextCaseLink}>
              <span className={styles.nextLabel} data-sanity={homeAttr("nextProjectLabel")}>
                {data?.nextProjectLabel || "Next Project"}
              </span>
              <span className={styles.nextTitle} data-sanity={homeAttr("continueReadingLabel")}>
                {data?.continueReadingLabel || "Continue reading →"}
              </span>
            </Link>
          </footer>
        )}
      </article>
    </>
  );
}
