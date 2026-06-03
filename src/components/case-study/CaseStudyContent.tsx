"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { stegaClean } from "next-sanity";
import type { CaseStudy } from "@/lib/cases";
import { defaultLocale, type Locale, withLocalePath } from "@/lib/i18n";
import type { HomePage } from "@/sanity/lib/types";
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
            <span className={styles.arrow}>←</span> {data?.backToIndexLabel || "Back to index"}
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
            <motion.h1 variants={fadeUp} className={styles.title}>
              {study.title}
            </motion.h1>
            
            <motion.div variants={fadeUp} className={styles.metaContainer}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>{data?.industryLabel || "Industry"}</span>
                <span className={styles.metaValue}>{study.industry}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>{data?.yearLabel || "Year"}</span>
                <span className={styles.metaValue}>{study.year}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>{data?.focusLabel || "Focus"}</span>
                <span className={styles.metaValue}>{study.focus}</span>
              </div>
            </motion.div>

            <motion.p variants={fadeUp} className={styles.heroQuote}>
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
            <h2 className={styles.sectionTitle}>{data?.challengeSectionTitle || "The Challenge"}</h2>
            <p className={styles.bodyText}>{study.challenge}</p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className={styles.col}
          >
            <h2 className={styles.sectionTitle}>{data?.approachSectionTitle || "The Approach"}</h2>
            <p className={styles.bodyText}>{study.approach}</p>
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
            <h2 className={styles.sectionTitle}>{data?.processSectionTitle || "The Process"}</h2>
          </motion.div>
          
          <div className={styles.processGrid}>
            {study.process.map((step: { number: string; title: string; description: string }, index: number) => (
              <motion.div
                key={step.number}
                className={styles.processStep}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className={styles.stepHeader}>
                  <span className={styles.stepNumber}>{step.number}</span>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                </div>
                <p className={styles.stepDescription}>{step.description}</p>
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
              <h2 className={styles.sectionTitle}>{data?.gallerySectionTitle || "Gallery"}</h2>
            </motion.div>

            <div className={styles.galleryGrid}>
              {study.galleryUrls.map((imageSrc: string, index: number) => (
                <motion.div
                  key={index}
                  className={styles.galleryImageWrapper}
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
            <h2 className={styles.sectionTitle}>{data?.deliverablesSectionTitle || "Deliverables"}</h2>
            <ul className={styles.deliverablesList}>
              {study.deliverables.map((item: string, i: number) => (
                <li key={i} className={styles.deliverableItem}>{item}</li>
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
            <h2 className={styles.sectionTitle}>{data?.impactSectionTitle || "The Impact"}</h2>
            <p className={styles.resultsText}>{study.results}</p>
          </motion.div>
        </section>

        {/* Next Case Footer */}
        {nextCaseSlug && (
          <footer className={styles.nextCaseFooter}>
            <Link href={withLocalePath(locale, `/case/${nextCaseSlug}`)} className={styles.nextCaseLink}>
              <span className={styles.nextLabel}>{data?.nextProjectLabel || "Next Project"}</span>
              <span className={styles.nextTitle}>{data?.continueReadingLabel || "Continue reading →"}</span>
            </Link>
          </footer>
        )}
      </article>
    </>
  );
}
