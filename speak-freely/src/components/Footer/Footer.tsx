"use client";

import Image from "next/image";
import styles from "./Footer.module.css";
import navData from "@/data/nav.json";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`sf-container ${styles.inner}`}>
        {/* Brand block */}
        <div className={styles.brand}>
          <a href="#top" className={styles.logoLink} aria-label="Speak Freely home">
            <Image
              src="/stacked.png"  
              alt="Speak Freely UGA logo"
              width={180}
              height={60}
              className={styles.logo}
            />
          </a>
          <p className={styles.tagline}>
            Disclaimer: This is not an official UGA website.
          </p>
        </div>

        {/* Site links (mirrors Header) */}
        <nav aria-label="Footer navigation" className={styles.nav}>
          <h3 className={styles.navTitle}>Explore</h3>
          <ul>
          {navData.map((item) => (
            <li key={item.id}>
              <a href={item.href} {...(item.external ? { target:"_blank", rel:"noopener noreferrer" } : {})}>
                {item.label}
              </a>

            </li>
          ))}

          </ul>
        </nav>

        {/* Contact / Credits */}
        <div className={styles.meta}>
          <h3 className={styles.navTitle}>Contact</h3>
          <ul className={styles.metaList}>
            <li>
              <a href="mailto:policies@uga.edu">policies@uga.edu</a>
            </li>
            <li>
              <a
                href="https://freedomofexpression.uga.edu/"
                target="_blank"
                rel="noopener noreferrer"
              >
                University of Georgia FOE
              </a>
            </li>
          </ul>

          <div className={styles.credits}>
            <small>© {year} Speak Freely · New Media Institute</small>
          </div>
          <a href="#top" className={styles.backToTop}>Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}
