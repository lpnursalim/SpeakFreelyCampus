"use client";

import styles from "./Tagline.module.css";

type Props = {
  children: React.ReactNode;
};

export default function Tagline({ children }: Props) {
  return (
    <section className={styles.section} aria-label="Site tagline">
      <div className={styles.wrap}>
        <p className={styles.text}>{children}</p>
      </div>
    </section>
  );
}
