"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Header.module.css";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={styles.header}>
      <div className={`${styles.inner} sf-container`}>
        <Link href="/" className={styles.logoLink} onClick={closeMenu}>
          <Image
            src="/horizontal.png"
            alt="Speak Freely logo"
            className={styles.logo}
            width={200}
            height={60}
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.nav} aria-label="Primary">
          <ul>
            <li><Link href="/#map"><span>MAP</span></Link></li>
            <li><Link href="/#info"><span>INFO</span></Link></li>
            <li>
            <a
                href="https://chatgpt.com/g/g-68be0b2e118c81918c1cab086bf8a48d-speak-freely-uga-free-speech-assistant"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>GPT</span>
              </a>
            </li>
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className={styles.menuButton}
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <div className={styles.menuIcon} />
        </button>
      </div>

      {/* Mobile Dropdown */}
      <nav className={`${styles.mobileNav} ${menuOpen ? styles.mobileNavOpen : ""}`} aria-label="Mobile">
        <ul>
          <li><a href="#map" onClick={closeMenu}><span>MAP</span></a></li>
          <li><a href="#info" onClick={closeMenu}><span>INFO</span></a></li>
          <li>
            <a
              href="https://chatgpt.com/g/g-68be0b2e118c81918c1cab086bf8a48d-speak-freely-uga-free-speech-assistant"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
            >
              <span>GPT</span>
          </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
