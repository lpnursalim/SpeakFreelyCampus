"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./ExploreCards.module.css";

const CARDS = [
  {
    id: "map",
    title: "MAP",
    desc: "See where and how your free speech rights apply across campus.",
    img: "/Map_Card.png",
  },
  {
    id: "info",
    title: "INFO",
    desc: "Your quick guide to free expression on campus.",
    img: "/Info_Card.png",
  },
  {
    id: "gpt",
    title: "GPT",
    desc: "Got questions about free expression? Chat with our campus GPT.",
    img: "/GPT_Card.png",
    href: "https://chatgpt.com/g/g-68be0b2e118c81918c1cab086bf8a48d-speak-freely-uga-free-speech-assistant",
    external: true,
  },
];

export default function ExploreCards() {
  return (
    <section id="explore" className={styles.section} aria-labelledby="explore-heading">
      <div className="sf-container">
        <h2 id="explore-heading" className={styles.heading}>Explore</h2>

        <ul className={styles.grid}>
            {CARDS.map((c) => (
            <li key={c.id} className={styles.item}>
                <a
                    href={c.external ? c.href : `/#${c.id}`}   // fallback to /#map or /#info
                    {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className={styles.card}
                    aria-label={`${c.title} section`}
                >
                <div className={styles.frame}>
                    <Image src={c.img} alt="" fill sizes="(min-width: 1024px) 30vw, (min-width: 700px) 45vw, 90vw" className={styles.image}/>
                </div>
                <div className={styles.meta}>
                    <h3 className={styles.title}>{c.title}</h3>
                    <p className={styles.desc}>{c.desc}</p>
                </div>
                </a>
            </li>
            ))}

        </ul>
      </div>
    </section>
  );
}
