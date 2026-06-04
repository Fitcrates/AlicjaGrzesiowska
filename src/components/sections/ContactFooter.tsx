"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { HomePage } from "@/sanity/lib/types";
import styles from "./ContactFooter.module.css";
import { defaultLocale, type Locale } from "@/lib/i18n";
import {
  localizedSanityPath,
  sanityDataAttribute,
  type SanityPath,
} from "@/sanity/visual-editing";

export default function ContactFooter({ data, locale = defaultLocale }: { data?: HomePage | null; locale?: Locale }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">("idle");

  const title = data?.footerTitle || "Let's work together.";
  const email = data?.footerEmail || "hello@alicja.com";
  const sectionLabel = data?.contactSectionLabel || "Contact";
  const nameLabel = data?.nameLabel || "Name";
  const emailLabel = data?.emailLabel || "Email";
  const messageLabel = data?.messageLabel || "Message";
  const sendingLabel = data?.sendingLabel || "Sending...";
  const sendMessageLabel = data?.sendMessageLabel || "Send Message →";
  const formSuccessMessage = data?.formSuccessMessage || "Message sent successfully.";
  const formErrorMessage = data?.formErrorMessage || "Something went wrong. Please try again.";
  const footerLocation = data?.footerLocation || "Warsaw, PL";
  const footerTagline = data?.footerTagline || "Information Architecture & Content Strategy";
  const footerLinks = data?.footerLinks || [];
  const homeId = data?._id || "homePage";
  const homeType = data?._type || "homePage";
  const homeAttr = (path: SanityPath) =>
    sanityDataAttribute({
      id: homeId,
      type: homeType,
      path: localizedSanityPath(locale, path),
    });
  const homeRootAttr = (path: SanityPath) =>
    sanityDataAttribute({
      id: homeId,
      type: homeType,
      path,
    });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus("idle");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      // TODO: Replace with actual Resend API route call e.g. await fetch('/api/contact', { ... })
      // Simulating API call for now
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Form data ready for Resend:", data);

      setFormStatus("success");
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error(error);
      setFormStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section id="contact" className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionNumber}>05</span>
          <span className={styles.sectionLabel} data-sanity={homeAttr("contactSectionLabel")}>
            {sectionLabel}
          </span>
        </div>

        <div className={styles.content}>
          <motion.div
            className={styles.left}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className={styles.heading} data-sanity={homeAttr("footerTitle")}>
              {title.split('\n').map((line: string, i: number) => (
                <span key={i}>
                  {line}
                  {i < title.split('\n').length - 1 && <br />}
                </span>
              ))}
            </h2>
          </motion.div>

          <div className={styles.right}>
            <form className={styles.contactForm} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label} data-sanity={homeAttr("nameLabel")}>
                  {nameLabel}
                </label>
                <input type="text" id="name" name="name" required className={styles.input} />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label} data-sanity={homeAttr("emailLabel")}>
                  {emailLabel}
                </label>
                <input type="email" id="email" name="email" required className={styles.input} />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message" className={styles.label} data-sanity={homeAttr("messageLabel")}>
                  {messageLabel}
                </label>
                <textarea id="message" name="message" required className={styles.textarea}></textarea>
              </div>

              <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
                <span data-sanity={homeAttr(isSubmitting ? "sendingLabel" : "sendMessageLabel")}>
                  {isSubmitting ? sendingLabel : sendMessageLabel}
                </span>
              </button>

              {formStatus === "success" && (
                <span className={styles.label} style={{ color: "var(--color-accent)" }}>
                  <span data-sanity={homeAttr("formSuccessMessage")}>{formSuccessMessage}</span>
                </span>
              )}
              {formStatus === "error" && (
                <span className={styles.label} style={{ color: "var(--color-terracotta)" }}>
                  <span data-sanity={homeAttr("formErrorMessage")}>{formErrorMessage}</span>
                </span>
              )}
            </form>

            <div className={styles.contactInfo} style={{ marginTop: "var(--spacing-xl)" }}>
              <a href={`mailto:${email}`} className={styles.contactLink} data-sanity={homeRootAttr("footerEmail")}>
                {email}
              </a>
              <p className={styles.contactAddress} data-sanity={homeAttr("footerLocation")}>
                {footerLocation}
              </p>
              {footerLinks.length > 0 && (
                <div className={styles.socialLinks}>
                  {footerLinks.map((link, i) => (
                    <a
                      key={i}
                      href={link.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                      data-sanity={homeAttr(["footerLinks", i, "label"])}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerLeft}>
          <span className={styles.footerText}>
            &copy; {new Date().getFullYear()} Alicja Grzesiowska.{" "}
            <span data-sanity={homeAttr("footerTagline")}>{footerTagline}</span>
          </span>
        </div>
        <div className={styles.footerRight}>
          <span className={styles.footerText}>
            {locale === "pl" ? "Realizacja:" : "Developed by"}{" "}
            <a href="https://appcrates.pl" target="_blank" rel="noopener noreferrer" className={styles.developerLink}>
              Arkadiusz Wawrzyniak (appcrates.pl)
            </a>
          </span>
        </div>
      </footer>
    </>
  );
}
