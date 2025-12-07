"use client";

import React from "react";
import styles from "./QuickGuide.module.css";
import quickGuideData from "@/data/quick-guide.json";

export default function QuickGuide() {
  return (
    <section id="info" className={styles.quickGuide}>
      <div className={`sf-container ${styles.inner}`}>
        <h2 className={styles.heading}>INFO – QUICK GUIDE</h2>

        <ul className={styles.list}>
          {quickGuideData.map((item) => {
            if (item.type === "note") {
              return (
                <li key={item.id} className={`${styles.item} ${styles.note}`}>
                  <h3 className={styles.noteTitle}>{item.title}</h3>
                  <p>{item.text}</p>
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.noteLink}
                    >
                      Learn more ↗
                    </a>
                  )}
                </li>
              );
            }

            return (
              <li key={item.id} className={styles.item}>
                {item.text}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
