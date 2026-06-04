"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { stegaClean } from "next-sanity";
import { defaultLocale, type Locale } from "@/lib/i18n";
import type { Challenge, HomePage, PortfolioCase } from "@/sanity/lib/types";
import styles from "./ChallengeSelection.module.css";

import PortfolioGrid from "./PortfolioGrid";

const defaultChallenges: Challenge[] = [
  {
    id: "challenge-a",
    number: "01",
    title: "Our content doesn't drive business outcomes.",
    pathHero: "Every piece of content should have a job. When it doesn't, it's just noise.",
    pathContent: [
      {
        heading: "The Problem",
        body: "Information is everywhere, but understanding is not. Most systems are built to collect, not to clarify. Content is produced in silos, measured by volume rather than impact, and disconnected from overarching business goals."
      },
      {
        heading: "Our Approach",
        body: "We don't just audit content; we audit intent. We align every piece of information with specific user journeys and business objectives, creating a strategic framework where content actively drives outcomes."
      },
      {
        heading: "The Impact",
        body: "Organizations see a shift from content as a cost center to content as a strategic asset. Conversion rates improve, support tickets decrease, and users find what they need with confidence."
      }
    ],
    relatedCases: ["from-insight-to-action"],
    nextChallengeId: "challenge-b",
  },
  {
    id: "challenge-b",
    number: "02",
    title: "People don't understand what we do.",
    pathHero: "When everything is equally visible, nothing stands out.",
    pathContent: [
      {
        heading: "The Problem",
        body: "Your value proposition is buried under industry jargon and complex feature lists. Prospects arrive at your touchpoints and leave confused, unable to quickly grasp how you solve their specific problems."
      },
      {
        heading: "Our Approach",
        body: "We design information architectures that surface what matters most. By building clear hierarchies and defining priorities, we strip away the noise and translate complex capabilities into clear, actionable value."
      },
      {
        heading: "The Impact",
        body: "Clarity breeds confidence. Sales cycles shorten because prospects immediately understand your value, and your brand becomes synonymous with solving their core challenges."
      }
    ],
    relatedCases: ["reframing-complexity"],
    nextChallengeId: "challenge-c",
  },
  {
    id: "challenge-c",
    number: "03",
    title: "Knowledge is scattered across the organization.",
    pathHero: "The challenge is not access to data — it's the structure behind it.",
    pathContent: [
      {
        heading: "The Problem",
        body: "Decades of institutional knowledge are locked in people's heads, disparate drives, and legacy systems. When experienced staff leave, expertise vanishes. Teams spend countless hours reinventing the wheel."
      },
      {
        heading: "Our Approach",
        body: "We map your knowledge ecosystem and design living systems that make connections visible. We build taxonomies and architectures that capture knowledge in context, turning static archives into dynamic assets."
      },
      {
        heading: "The Impact",
        body: "Onboarding times plummet. Cross-disciplinary collaboration flourishes as teams discover previously hidden connections. Your organization's collective intelligence becomes accessible and scalable."
      }
    ],
    relatedCases: ["reframing-complexity", "from-insight-to-action"],
    nextChallengeId: "challenge-d",
  },
  {
    id: "challenge-d",
    number: "04",
    title: "Teams communicate different versions of the same story.",
    pathHero: "Insight without structure is just noise.",
    pathContent: [
      {
        heading: "The Problem",
        body: "Marketing says one thing, Sales says another, and Product uses completely different terminology. This fragmentation erodes trust with customers and creates internal friction."
      },
      {
        heading: "Our Approach",
        body: "We establish a single source of truth through unified governance frameworks and shared vocabularies. We transform scattered observations into reusable structures so every team speaks from the same baseline."
      },
      {
        heading: "The Impact",
        body: "A cohesive brand voice across all touchpoints. Internal alignment accelerates go-to-market strategies, and customers experience a seamless, trustworthy journey from awareness to retention."
      }
    ],
    relatedCases: ["connecting-the-system"],
    nextChallengeId: "challenge-a",
  },
];

export default function ChallengeSelection({
  data,
  challenges: sanityChallenges,
  cases,
  locale = defaultLocale,
}: {
  data?: HomePage | null;
  challenges?: Challenge[];
  cases?: PortfolioCase[];
  locale?: Locale;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  // Use Sanity data or fallback to default
  const activeChallenges = sanityChallenges && sanityChallenges.length > 0 ? sanityChallenges : defaultChallenges;
  const introText = data?.challengeIntroText || "Every piece of content starts with a decision.";
  const introHeading = data?.challengeIntroHeading || "Choose your challenge:";
  const sectionLabel = data?.challengesSectionLabel || "Challenges";
  const singleChallengeLabel = data?.challengeLabel || "Challenge";
  const nextChallengeLabelText = data?.nextChallengeLabel || "Next Challenge";

  const selectedChallenge = activeChallenges.find((c) => c._id === selectedId || c.id === selectedId);
  const nextChallenge = activeChallenges.find((c) => 
    (c._id === selectedChallenge?.nextChallengeId) || 
    (c.id === selectedChallenge?.nextChallengeId)
  );
  const selectedRelatedCases = selectedChallenge?.relatedCases?.map((slug) => stegaClean(slug));

  return (
    <section id="challenges" className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionNumber}>01</span>
        <span className={styles.sectionLabel}>{sectionLabel}</span>
      </div>

      <div className={styles.introContainer}>
        <p className={styles.introText}>{introText}</p>
        <h2 className={styles.introHeading}>{introHeading}</h2>
      </div>

      <div className={styles.grid}>
        {activeChallenges.map((challenge, index) => {
          const challengeId = challenge._id || challenge.id

          return (
          <motion.div
            key={challengeId}
            className={styles.column}
            onClick={() => setSelectedId(challengeId || null)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <span className={styles.columnNumber}>{challenge.number}</span>
            <p className={styles.columnText}>{challenge.title}</p>
          </motion.div>
          )
        })}
      </div>

      <AnimatePresence>
        {selectedId && selectedChallenge && (
          <motion.div
            className={styles.expandedOverlay}
            initial={{ clipPath: "circle(0% at 50% 50%)" }}
            animate={{ clipPath: "circle(150% at 50% 50%)" }}
            exit={{ clipPath: "circle(0% at 50% 50%)" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={styles.textureOverlay}></div>
            
            <button
              className={styles.closeButton}
              onClick={() => setSelectedId(null)}
            >
              <X size={24} />
            </button>

            <div className={styles.scrollContainer}>
              <div className={styles.expandedInner}>
                <header className={styles.pathHeader}>
                  <span className={styles.pathLabel}>{singleChallengeLabel} {selectedChallenge.number}</span>
                  <h2 className={styles.pathTitle}>{selectedChallenge.title}</h2>
                  <p className={styles.pathHero}>{selectedChallenge.pathHero}</p>
                </header>

                <div className={styles.pathContent}>
                  {selectedChallenge.pathContent?.map((section, idx) => (
                    <div key={idx} className={styles.pathSection}>
                      <h3 className={styles.pathSectionHeading}>{section.heading}</h3>
                      <p className={styles.pathSectionBody}>{section.body}</p>
                    </div>
                  ))}
                </div>

                <div className={styles.pathPortfolio}>
                  <PortfolioGrid caseSlugs={selectedRelatedCases} cases={cases} locale={locale} isCompact />
                </div>

                {nextChallenge && (
                  <footer className={styles.pathFooter} onClick={() => {
                    const scrollContainer = document.querySelector(`.${styles.scrollContainer}`);
                    if (scrollContainer) scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
                    setTimeout(() => setSelectedId(nextChallenge._id || nextChallenge.id || null), 300);
                  }}>
                    <div className={styles.nextPrompt}>{nextChallengeLabelText}</div>
                    <h3 className={styles.nextTitle}>{nextChallenge.title} →</h3>
                  </footer>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
