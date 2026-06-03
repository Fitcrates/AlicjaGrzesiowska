"use client";

import { useState } from "react";
import type { HomePage } from "@/sanity/lib/types";
import Hero from "./Hero";
import HeroV2 from "./HeroV2";
import styles from "./HeroSwitcher.module.css";
import { motion, AnimatePresence } from "framer-motion";

export default function HeroSwitcher({ data }: { data?: HomePage | null }) {
  const [isV2, setIsV2] = useState(false);

  return (
    <div className={styles.switcherContainer}>
      <div className={styles.toggleWrapper}>
        <span className={styles.label} onClick={() => setIsV2(false)}>V1</span>
        <label className={styles.switch}>
          <input 
            type="checkbox" 
            checked={isV2} 
            onChange={(e) => setIsV2(e.target.checked)} 
          />
          <span className={styles.slider}></span>
        </label>
        <span className={styles.label} onClick={() => setIsV2(true)}>V2</span>
      </div>

      <AnimatePresence mode="wait">
        {isV2 ? (
          <motion.div
            key="v2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <HeroV2 data={data} />
          </motion.div>
        ) : (
          <motion.div
            key="v1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <Hero data={data} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
