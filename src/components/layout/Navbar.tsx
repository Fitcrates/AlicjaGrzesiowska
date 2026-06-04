"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const params = useParams();
  const lang = params?.lang as string || "en";

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuVariants = {
    closed: {
      opacity: 0,
      y: "-100%",
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className={styles.navDesktop}>
        <span className={styles.brand}>Alicja Grzesiowska</span>
        <ul className={styles.navLinks}>
          <li>
            <Link href={`/${lang}#challenges`} className={styles.navLink}>Work</Link>
          </li>
          <li>
            <Link href={`/${lang}/about`} className={styles.navLink}>About</Link>
          </li>
          <li>
            <Link href={`/${lang}#knowledge`} className={styles.navLink}>Method</Link>
          </li>
          <li>
            <Link href={`/${lang}#perspectives`} className={styles.navLink}>Perspectives</Link>
          </li>
        </ul>
        <Link href={`/${lang}#contact`} className={styles.navLink}>Contact</Link>
      </nav>

      {/* Mobile Navigation */}
      <nav className={styles.navMobile}>
        <span className={styles.brand}>Alicja Grzesiowska</span>
        <button className={styles.menuToggle} onClick={toggleMenu} aria-label="Toggle menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              className={styles.mobileMenu}
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
            >
              <ul className={styles.mobileNavLinks}>
                <li>
                  <Link href={`/${lang}#challenges`} className={styles.mobileNavLink} onClick={toggleMenu}>
                    Work
                  </Link>
                </li>
                <li>
                  <Link href={`/${lang}/about`} className={styles.mobileNavLink} onClick={toggleMenu}>
                    About
                  </Link>
                </li>
                <li>
                  <Link href={`/${lang}#knowledge`} className={styles.mobileNavLink} onClick={toggleMenu}>
                    Method
                  </Link>
                </li>
                <li>
                  <Link href={`/${lang}#perspectives`} className={styles.mobileNavLink} onClick={toggleMenu}>
                    Perspectives
                  </Link>
                </li>
                <li>
                  <Link href={`/${lang}#contact`} className={styles.mobileNavLink} onClick={toggleMenu}>
                    Contact
                  </Link>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
