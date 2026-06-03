"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import styles from "./AboutHero.module.css";
import type { AboutPage } from "@/sanity/lib/types";

export default function AboutHero({ data }: { data?: AboutPage | null }) {
  const params = useParams();
  const lang = params?.lang as string || "en";

  if (!data) return null;

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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {data.title || "About Me"}
          </motion.h1>
          
          {data.subtitle && (
            <motion.p 
              className={styles.subtitle}
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
                {section.heading && <h3 className={styles.storyHeading}>{section.heading}</h3>}
                {section.body && (
                  <div className={styles.storyBody}>
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
            {data.experienceTitle && <h2 className={styles.experienceTitle}>{data.experienceTitle}</h2>}
            
            <div className={styles.experienceList}>
              {data.experience?.map((job, index) => (
                <div key={index} className={styles.experienceItem}>
                  <div>
                    <h4 className={styles.experienceRole}>{job.role}</h4>
                    <span className={styles.experienceCompany}>{job.company}</span>
                  </div>
                  {job.years && <span className={styles.experienceYears}>{job.years}</span>}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
