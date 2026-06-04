"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import styles from "./AboutHero.module.css";
import type { AboutPage } from "@/sanity/lib/types";
import { getLocale } from "@/lib/i18n";
import {
  keyedPath,
  localizedSanityPath,
  sanityDataAttribute,
  type SanityPath,
} from "@/sanity/visual-editing";

export default function AboutHero({ data }: { data?: AboutPage | null }) {
  const params = useParams();
  const lang = getLocale(params?.lang as string | undefined);

  if (!data) return null;

  const aboutId = data._id || "aboutPage";
  const aboutType = data._type || "aboutPage";
  const editAttr = (path: SanityPath) =>
    sanityDataAttribute({
      id: aboutId,
      type: aboutType,
      path: localizedSanityPath(lang, path),
    });
  const rootAttr = (path: SanityPath) =>
    sanityDataAttribute({
      id: aboutId,
      type: aboutType,
      path,
    });

  return (
    <section className={styles.section}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={styles.breadcrumb}
        >
          <Link href={`/${lang}`}>← Back</Link>
        </motion.div>

        <div className={styles.heroTopSection}>
          <div className={styles.heroContent}>
          <motion.h1 
            className={styles.title}
            data-sanity={editAttr("title")}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {data.title || "About Me"}
          </motion.h1>
          
          {data.subtitle && (
            <motion.p 
              className={styles.subtitle}
              data-sanity={editAttr("subtitle")}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {data.subtitle}
            </motion.p>
          )}
        </div>

        {data.profileImageUrl && (
          <motion.div 
            className={styles.imageWrapper}
            data-sanity={rootAttr("profileImage")}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <Image 
              src={data.profileImageUrl} 
              alt={data.title || "Profile picture"} 
              fill
              className={styles.image}
              priority
            />
          </motion.div>
        )}
        </div>

        <div className={styles.contentGrid}>
          {/* Story Section */}
          <div className={styles.storySection}>
            {data.story?.map((section, index) => (
              <motion.div 
                key={index} 
                className={styles.storyBlock}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {section.heading && (
                  <h3
                    className={styles.storyHeading}
                    data-sanity={editAttr(["story", ...keyedPath(section._key, index), "heading"])}
                  >
                    {section.heading}
                  </h3>
                )}
                {section.body && (
                  <div
                    className={styles.storyBody}
                    data-sanity={editAttr(["story", ...keyedPath(section._key, index), "body"])}
                  >
                    {section.body.split('\n').map((line, i) => (
                      <span key={i}>
                        {line}
                        {i < section.body!.split('\n').length - 1 && <><br /><br /></>}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Experience Section */}
          <motion.div 
            className={styles.experienceSection}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            {data.experienceTitle && (
              <h2 className={styles.experienceTitle} data-sanity={editAttr("experienceTitle")}>
                {data.experienceTitle}
              </h2>
            )}
            
            <div className={styles.experienceList}>
              {data.experience?.map((job, index) => (
                <div key={index} className={styles.experienceItem}>
                  <div>
                    <h4
                      className={styles.experienceRole}
                      data-sanity={editAttr(["experience", ...keyedPath(job._key, index), "role"])}
                    >
                      {job.role}
                    </h4>
                    <span
                      className={styles.experienceCompany}
                      data-sanity={editAttr(["experience", ...keyedPath(job._key, index), "company"])}
                    >
                      {job.company}
                    </span>
                  </div>
                  {job.years && (
                    <span
                      className={styles.experienceYears}
                      data-sanity={editAttr(["experience", ...keyedPath(job._key, index), "years"])}
                    >
                      {job.years}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
